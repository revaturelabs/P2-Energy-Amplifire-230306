import { LightningElement , wire, track} from 'lwc';
import getCustomerList from '@salesforce/apex/LWCHelper.getCustomerList';
import  { subscribe, MessageContext} from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class LightningDatatableLWCExample extends LightningElement {
    @track columns = [{
            label: 'First name',
            fieldName: 'FirstName',
            type: 'text',
            editable: true,
        },
        {
            label: 'Last Name',
            fieldName: 'LastName',
            type: 'text',
            editable: true,
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone',
            editable: true,
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'text',
            editable: true,
        },
        {
            label: 'Account',
            fieldName: 'accountName',
            type: 'text',
            editable: false,
        },
    ];

    
    cusFirstNameSearch = '';
    cusLastNameSearch = '';
    cusPhoneSearch = '';
    cusEmailSearch = '';
    cusAccountSearch = '';


    handleMessage(message) {
        if (message.type === "cusfname")
            this.cusFirstNameSearch = message.fnameField;
        if (message.type === "cuslname")
            this.cusLastNameSearch = message.lnameField;
        if (message.type === "cusphone")
            this.cusPhoneSearch = message.cusPhoneField;
        if (message.type === "cusemail")
            this.cusEmailSearch = message.cusEmailField;
        if (message.type === "cusaccount")
            this.cusAccountSearch = message.cusAccountField;
        if (message.type === "cusRender")
        {
            this.cusFirstNameSearch = "";
            this.cusLastNameSearch = "";
            this.cusPhoneSearch = "";
            this.cusEmailSearch = "";
            this.cusAccountSearch = "";
            this.renderedCallback();
        }
        if (message.type === "cusSubmit"){
            const myTimeout = setTimeout(refreshApex, 500, this.wiredResult);
        }
    }


    @track error;
    @track customerList;
    wiredResult;

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

    @wire(MessageContext)
    messageContext;

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
            this.customerList = undefined;
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
                    message: 'Customer deleted',
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
                    message: 'Customers updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.wiredResult);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Customers',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}
