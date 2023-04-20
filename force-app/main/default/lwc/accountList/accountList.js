import { LightningElement , wire, track} from 'lwc';
import getAccountList from '@salesforce/apex/LWCHelper.getAccountList';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import  { subscribe, MessageContext, createMessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class LightningDatatableLWCExample extends LightningElement {
    accNameSearch = '';
    accPhoneSearch = '';
    accIndustrySearch = '';
    accRatingSearch = '';    

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    accountMetadata;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId', 
            fieldApiName: RATING_FIELD
        }
    )
    ratingOptions;
 
    @track columns = [{
            label: 'Account name',
            fieldName: 'Name',
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
            label: 'Industry',
            fieldName: 'Industry',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Rating', 
            fieldName: 'Rating', 
            type: 'text', 
            editable: true,
            sortable: true,
        }, 
        {
            label: 'Avg Opportunity', 
            fieldName: 'Average_Amount_of_Opportunities__c', 
            type: 'currency', 
            editable: false,
            sortable: true,
        }
    ];

    @track error;
    @track accList;
    wiredResult;

    @wire(getAccountList,
        {
            nameAccountSearchTerm: '$accNameSearch', 
            phoneAccountSearchTerm: '$accPhoneSearch',
            industryAccountSearchTerm: '$accIndustrySearch',
            ratingAccountSearchTerm: '$accRatingSearch',
        }
        )
    wiredAccounts(result) {
        this.wiredResult = result;
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
                    message: 'Accounts deleted',
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
            await refreshApex(this.wiredResult);

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

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            NAME_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
        );
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
        if (message.type === "accSubmit"){
            const myTimeout = setTimeout(refreshApex, 500, this.wiredResult);
        }
        }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    

    // Sort function
    sortedBy;
    sortDirection = 'asc';

    updateColumnSorting(event){
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sort(this.sortedBy,this.sortDirection);
    }

    sort(fieldName, direction){
        let parseData = JSON.parse(JSON.stringify(this.accList));
        let keyVal = (a) => {
            return a[fieldName]
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x,y) => {
            x = keyVal(x) ? keyVal(x) : '';
            y = keyVal(y) ? keyVal(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.accList = parseData;
    }

}