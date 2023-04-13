import { LightningElement , wire, track} from 'lwc';
import getLeadList from '@salesforce/apex/LWCHelper.getLeadList';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
export default class LightningDatatableLWCExample extends LightningElement {
    @track columns = [{
            label: 'Lead name',
            fieldName: 'Name',
            type: 'text',
        },
        {
            label: 'Company',
            fieldName: 'Company',
            type: 'text',
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone',
        },
        {
            label: 'Email',
            fieldName: 'Email',
            type: 'text',
        },
        {
            label: 'Rating',
            fieldName: 'Rating',
            type: 'text',
        },
        {
            label: 'Status',
            fieldName: 'Status',
            type: 'text',
        },
    ];
 
    leadNameSearch = '';
    leadCompanySearch = '';
    leadPhoneSearch = '';
    leadEmailSearch = '';
    leadRatingSearch = '';
    leadStatusSearch = '';

    @track error;
    @track leadList;
    wiredLeadsResult;

    @wire(getLeadList,
        {
            nameLeadSearchTerm: '$leadNameSearch', 
            companyLeadSearchTerm: '$leadCompanySearch',
            phoneLeadSearchTerm: '$leadPhoneSearch',
            emailLeadSearchTerm: '$leadEmailSearch',
            ratingLeadSearchTerm: '$leadRatingSearch',
            statusLeadSearchTerm: '$leadStatusSearch',
        }
        )
    wiredLeads(result) {
        this.wiredLeadsResult = result;
        if (result.data) {
            this.leadList = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.leadList = undefined;
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
            sObjectType: 'Lead',
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Lead deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredLeadsResult);
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
                    message: 'Leads updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.contacts);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Leads',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}
