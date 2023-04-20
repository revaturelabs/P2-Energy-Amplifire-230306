import { LightningElement , wire, track} from 'lwc';
import getOrderList from '@salesforce/apex/LWCHelper.getOrderList';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import  { subscribe, publish, MessageContext} from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import ORDER_SELECTED_CHANNEL from '@salesforce/messageChannel/orderSelected__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

export default class LightningDatatableLWCExample extends LightningElement {
    @track columns = [{
            label: 'Order Number',
            fieldName: 'OrderNumber',
            type: 'auto number',
            editable: false,
            sortable: true,
        },
        {
            label: 'Account Name',
            fieldName: 'accountName',
            type: 'text',
            editable: false,
            sortable: true,
        },
        {
            label: 'Start Date',
            fieldName: 'EffectiveDate',
            type: 'date',
            editable: true,
            sortable: true,
        },
        {
            label: 'Status',
            fieldName: 'Status',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Total Amount',
            fieldName: 'TotalAmount',
            type: 'currency',
            editable: false,
            sortable: true,
        },
    ];

    @wire(MessageContext)
    messageContext;
 
    orderNumberSearch = '';
    orderAccountIdSearch = '';
    orderAccountNameSearch = '';
    orderEffectiveDateSearch = '';
    orderStatusSearch = '';
    orderTotalAmountSearch = '';

    @track error;
    @track ordList;
    wiredResult;

    subscribeToMessageChannel() {
    this.subscription = subscribe(
        this.messageContext,
        NAME_SELECTED_CHANNEL,
        (message) => this.handleMessage(message)
      );
    }

    @wire(getOrderList,
        {
            numberOrderSearchTerm: '$orderNumberSearch', 
            accountIdOrderSearchTerm: '$orderAccountIdSearch',
            accountNameOrderSearchTerm: '$orderAccountNameSearch',
            effectiveDateOrderSearchTerm: '$orderEffectiveDateSearch',
            statusOrderSearchTerm: '$orderStatusSearch',
            totalAmountOrderSearchTerm: '$orderTotalAmountSearch',
        }
        )
    wiredOrders(result) {
        this.wiredResult = result;
        if (result.data) {console.log(result.data);
            this.ordList = result.data;
            this.ordList = this.ordList.map( item =>{
                item = {...item};
                if(item.AccountId){
                    item['accountName'] = item.Account.Name;
                    return item;
                }
                else{
                    item['accountName'] = '';
                    return item;
            }
            }
            )
            this.error = undefined;
        } else if (result.error) {console.log(result.error);
            this.error = result.error;
            this.ordList = undefined;
        }
    }
    selectedIds;

    getSelectedRec() {
        let selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecords.length > 0){
            console.log('selectedRecords are ', selectedRecords);
   
            let ids = '';
            selectedRecords.forEach(currentItem => {
                ids = ids + ',' + currentItem.Id;
            });
            this.selectedIds = ids.replace(/^,/, '');
        }
        if(selectedRecords[0]){
            const id = selectedRecords[0].Id;
            const payload = {
                orderIdField: id,
            };
            publish(this.messageContext,ORDER_SELECTED_CHANNEL,payload);
        }
    }

    handleDelete() {
        DELETE({
            idsToDelete: this.selectedIds, 
            sObjectType: 'Order',
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Orders deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredResult);
        })
        .catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting records',
                    message: reduceErrors(error).join(', '),
                    variant: 'error'
                })
            );
        });
        const prodReset = new CustomEvent(
            'prodreset', {
                detail: false 
            });
            this.dispatchEvent(prodReset);
    }

    handleMessage(message) {
        if (message.type === "orderNumber")
            this.orderNumberSearch = message.orderNumberField;
        if (message.type === "orderAccount")
            this.orderAccountNameSearch = message.orderAccountNameField;
        if (message.type === "orderStatus")
            this.orderStatusSearch = message.orderStatusField;
        if (message.type === "orderAmount")
            this.orderTotalAmountSearch = message.orderTotalAmountField;
        if  (message.type === "ordRender")
        {
            this.orderNumberSearch = "";
            this.orderAccountNameSearch = "";
            this.orderEffectiveDateSearch = "";
            this.orderStatusSearch = "";
            this.orderTotalAmountSearch = "";
            this.renderedCallback();
        }
        if (message.type === "ordSubmit"){
            const myTimeout = setTimeout(refreshApex, 500, this.wiredResult);
        }
     }  

    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    
    draftValues = [];

    async handleSave(event) {
        const records = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });

        this.draftValues = [];

        try {
            const recordUpdatePromises = records.map((record) =>
                updateRecord(record)
            );
            await Promise.all(recordUpdatePromises);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Orders updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.wiredResult);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Orders',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
    
    sortedBy;
    sortDirection = 'asc';

    updateColumnSorting(event){
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sort(this.sortedBy, this.sortDirection);
    }

    sort(fieldName, direction){
        let parseData = JSON.parse(JSON.stringify(this.ordList));
        let keyVal = (a) => {
            return a[fieldName]
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x,y) => {
            x = keyVal(x) ? keyVal(x) : '';
            y = keyVal(y) ? keyVal(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.ordList = parseData;
    }
}