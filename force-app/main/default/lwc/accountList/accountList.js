import { LightningElement , wire, track} from 'lwc';
import getAccountList from '@salesforce/apex/LWCHelper.getAccountList';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import  { subscribe, MessageContext} from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

export default class LightningDatatableLWCExample extends LightningElement {
    @wire(MessageContext)
    messageContext;

    accNameSearch = '';
    accPhoneSearch = '';
    accIndustrySearch = '';
    accRatingSearch = '';

    subscribeToMessageChannel() {

        
        this.subscription = subscribe(
            this.messageContext,
            NAME_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
          );
      }
      
 
    @track columns = [{
            label: 'Account name',
            fieldName: 'Name',
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
            label: 'Industry',
            fieldName: 'Industry',
            type: 'text',
            editable: true,
        },
        {
            label: 'Rating',
            fieldName: 'Rating',
            type: 'text',
            editable: true,
        }
    ];
 


    @track error;
    @track accList;
    wiredAccountsResult;

    @wire(getAccountList,
        {
            nameAccountSearchTerm: '$accNameSearch', 
            phoneAccountSearchTerm: '$accPhoneSearch',
            industryAccountSearchTerm: '$accIndustrySearch',
            ratingAccountSearchTerm: '$accRatingSearch',
        }
        )
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.accList = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.accList = undefined;
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
            sObjectType: 'Account',
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredAccountsResult);
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
                    message: 'Accounts updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.wiredAccountsResult);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Accounts',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }



 handleMessage(message) {
    if (message.type === "accrating")
    this.accRatingSearch = message.ratingField;
    if (message.type === "accname")
    this.accNameSearch = message.nameField;
    if (message.type === "accindustry")
    this.accIndustrySearch = message.industryField;
    if (message.type === "accphone")
    this.accPhoneSearch = message.phoneField;
    if (message.type === "reRender")
    {

   this.accNameSearch = "";
   this.accPhoneSearch = "";
   this.accIndustrySearch = "";
   this.accRatingSearch = "";
   this.renderedCallback();
    }
 }  

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

}
