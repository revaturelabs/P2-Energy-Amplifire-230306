import { LightningElement , wire, track} from 'lwc';
import getCustomerList from '@salesforce/apex/LWCHelper.getTechList';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import  { subscribe, MessageContext, createMessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import { updateRecord } from 'lightning/uiRecordApi';

export default class LightningDatatableLWCExample extends LightningElement {
    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            NAME_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    @track columns = [{
            label: 'First name',
            fieldName: 'FirstName',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Last Name',
            fieldName: 'LastName',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone',
            editable: true,
            sortable: true,
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Account',
            fieldName: 'accountName',
            type: 'text',
            editable: false,
            sortable: true,
        },
    ];
 
    cusFirstNameSearch = "";
    cusLastNameSearch = "";
    cusPhoneSearch = "";
    cusEmailSearch = "";
    cusAccountSearch = "";

    @track error;
    @track customerList;
    wiredResult;

    @wire(getCustomerList,
        {
            first: '$cusFirstNameSearch', 
            last: '$cusLastNameSearch',
            phone: '$cusPhoneSearch',
            email: '$cusEmailSearch',
            account: '$cusAccountSearch',
        }
        )
    wiredCustomers(result) {
        this.wiredResult = result;
        if (result.data) {
            this.customerList = result.data;
            this.customerList = this.customerList.map( item =>{
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
        } else if (result.error) {
            this.error = result.error;
            this.customerList = [];
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
            sObjectType: 'Contact',
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Technicians deleted',
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
    }

    handleMessage(message) {
        if (message.type === "techfname")
            this.cusFirstNameSearch = message.techfnameField;
        if (message.type === "techlname")
            this.cusLastNameSearch = message.techlnameField;
        if (message.type === "techPhone")
            this.cusPhoneSearch = message.techPhoneField;
        if (message.type === "techEmail")
            this.cusEmailSearch = message.techEmailField;
        if (message.type === "techAccount")
            this.cusAccountSearch = message.techAccountField;
        if (message.type === "techRender")
        {
            this.cusFirstNameSearch = "";
            this.cusLastNameSearch = "";
            this.cusPhoneSearch = "";
            this.cusEmailSearch = "";
            this.cusAccountSearch = "";
            this.renderedCallback();
        }
        if (message.type === "techSubmit"){
            const myTimeout = setTimeout(refreshApex, 500, this.wiredResult);
        }
    }
    
    draftValues = [];

    async handleSave(event) {
        const records = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });
        records.forEach(item => {
            console.log(JSON.parse(JSON.stringify(item)));
          });

        this.draftValues = [];

        try {
            const recordUpdatePromises = records.map((record) =>{
                updateRecord(record);
            }
            );
            await Promise.all(recordUpdatePromises);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Technicians updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.wiredResult);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Technicians',
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
        this.sort(this.sortedBy,this.sortDirection);
    }

    sort(fieldName, direction){
        let parseData = JSON.parse(JSON.stringify(this.customerList));
        let keyVal = (a) => {
            return a[fieldName]
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x,y) => {
            x = keyVal(x) ? keyVal(x) : '';
            y = keyVal(y) ? keyVal(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.customerList = parseData;
    }
}