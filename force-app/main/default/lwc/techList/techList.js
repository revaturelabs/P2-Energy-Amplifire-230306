import { LightningElement , wire, track} from 'lwc';
import getCustomerList from '@salesforce/apex/LWCHelper.getTechList';
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

    @track error;
    @track customerList;
    wiredCustomerResult;

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
        this.wiredCustomerResult = result;
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
                    message: 'Customer deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredCustomerResult);
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
            await refreshApex(this.wiredCustomerResult);

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