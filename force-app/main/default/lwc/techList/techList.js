import { LightningElement , wire, track} from 'lwc';
import getTechList from '@salesforce/apex/LWCHelper.getTechList';
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
 
    techFirstNameSearch = '';
    techLastNameSearch = '';
    techPhoneSearch = '';
    techEmailSearch = '';
    techAccountSearch = '';

    @track error;
    @track techList;
    wiredTechResult;

    @wire(getTechList,
        {
            first: '$techFirstNameSearch', 
            last: '$techLastNameSearch',
            phone: '$techPhoneSearch',
            email: '$techEmailSearch',
            account: '$techAccountSearch',
        }
        )
    wiredTechs(result) {
        this.wiredTechResult = result;
        if (result.data) {
            console.log(result.data);
            this.techList = result.data;
            this.techList = this.techList.map( item =>{
                item = {...item};
                item['accountName'] = item.Account.Name;
                return item;
            }
            )
            console.log(this.techList);
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.techList = undefined;
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
                    message: 'Technician deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredTechResult);
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
                    message: 'Technicians updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.wiredTechResult);

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
}