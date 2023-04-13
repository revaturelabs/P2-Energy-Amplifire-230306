import { LightningElement , wire, track} from 'lwc';
import getAccountList from '@salesforce/apex/LWCHelper.getAccountList';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

export default class LightningDatatableLWCExample extends LightningElement {
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
 
    accNameSearch = '';
    accPhoneSearch = '';
    accIndustrySearch = '';
    accRatingSearch = '';

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
}
