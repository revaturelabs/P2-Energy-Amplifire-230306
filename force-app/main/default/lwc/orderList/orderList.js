import { LightningElement , wire, track} from 'lwc';
import getOrderList from '@salesforce/apex/LWCHelper.getOrderList';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import  { subscribe, MessageContext} from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

export default class LightningDatatableLWCExample extends LightningElement {
    @track columns = [{
            label: 'Order Number',
            fieldName: 'OrderNumber',
            type: 'auto number',
            editable: false,
        },
        {
            label: 'Account Name',
            fieldName: 'accountName',
            type: 'text',
            editable: false,
        },
        {
            label: 'Start Date',
            fieldName: 'EffectiveDate',
            type: 'date',
            editable: true,
        },
        {
            label: 'Status',
            fieldName: 'Status',
            type: 'text',
            editable: true,
        },
        {
            label: 'Total Amount',
            fieldName: 'TotalAmount',
            type: 'currency',
            editable: false,
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
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecords.length > 0){
            console.log('selectedRecords are ', selectedRecords);
   
            let ids = '';
            selectedRecords.forEach(currentItem => {
                ids = ids + ',' + currentItem.Id;
            });
            this.selectedIds = ids.replace(/^,/, '');
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
                    message: 'Order deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredResult);
        })
        .catch((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: reduceErrors(error).join(', '),
                    variant: 'error'
                })
            );
        });
    }

    handleMessage(message) {
        if (message.type === "orderNumber")
        this.orderNumberSearch = message.orderNumberField;
        /*if (message.type === "orderAccountId")
        this.orderAccountIdSearch = message.orderAccountIdField;*/
        if (message.type === "orderAccount")
        this.orderAccountNameSearch = message.orderAccountNameField;
        if (message.type === "orderEffectiveDate")
        this.orderEffectiveDateSearch = message.orderEffectiveDateField;
        if (message.type === "orderStatus")
        this.orderStatusSearch = message.orderStatusField;
        if (message.type === "orderAmount")
        this.orderTotalAmountSearch = message.orderTotalAmountField;
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
}