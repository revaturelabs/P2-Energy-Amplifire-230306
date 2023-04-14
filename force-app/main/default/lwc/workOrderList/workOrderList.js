import { LightningElement , wire, track} from 'lwc';
import getWOList from '@salesforce/apex/LWCHelper.getWOList';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class LightningDatatableLWCExample extends LightningElement {
    @track columns = [{
            label: 'Name',
            fieldName: 'Name',
            type: 'text',
            editable: true,
        },
        {
            label: 'Account',
            fieldName: 'accountName',
            type: 'text',
            editable: false,
        },
        {
            label: 'Product Owner',
            fieldName: 'pOwner',
            type: 'text',
            editable: false,
        },
    ];
 
    nameSearch = '';
    accountSearch = '';
    productOwnerSearch = '';

    @track error;
    @track workOrderList;
    wiredWorkOrderResult;

    @wire(getWOList,
        {
            name: '$nameSearch', 
            account: '$accountSearch',
            productOwner: '$productOwnerSearch',
        }
        )
    wiredWO(result) {
        this.wiredWorkOrderResult = result;
        if (result.data) {
            console.log(result.data);
            this.workOrderList = result.data;
            this.workOrderList = this.workOrderList.map( item =>{
                item = {...item};
                if(item.Account__c){
                    item['accountName'] = item.Account__r.Name;
                }
                else{
                    item['accountName'] = '';
                }
                if(item.Product_Owner__c){
                    item['pOwner'] = item.Product_Owner__r.Name;
                    return item;
                }
                else{
                    item['pOwner'] = '';
                    return item;
                }
            }
            )
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.workOrderList = undefined;
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
            sObjectType: 'Work_Order__c',
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Work Order deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredWorkOrderResult);
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
                    message: 'Work Order updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.wiredWorkOrderResult);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Work Order',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}