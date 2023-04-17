import { LightningElement , wire, track} from 'lwc';
import  { subscribe, MessageContext} from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import getOppList from '@salesforce/apex/LWCHelper.getOppList';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
export default class LightningDatatableLWCExample extends LightningElement {
    @track columns = [{
            label: 'Opportunity name',
            fieldName: 'Name',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Account Name',
            fieldName: 'accountName',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Stage',
            fieldName: 'StageName',
            type: 'text',
            editable: true,
            sortable: true,
        },
        {
            label: 'Close Date',
            fieldName: 'CloseDate',
            type: 'date',
            editable: true,
            sortable: true,
        }
    ];
 
    oppNameSearch = '';
    oppAccountSearch = '';
    oppStageSearch = '';
    oppDateSearch = '';

    @track error;
    @track oppList;
    wiredOppResult;

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() { 
        this.subscription = subscribe(
            this.messageContext,
            NAME_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
          );
      }

    @wire(getOppList,
        {
            name: '$oppNameSearch', 
            account: '$oppAccountSearch',
            stage: '$oppStageSearch',
            close: '$oppDateSearch',
        }
        )
    wiredOpps(result) {
        this.wiredOppResult = result;
        if (result.data) {
            this.oppList = result.data;
            this.oppList = this.oppList.map( item =>{
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
            this.oppList = undefined;
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
            sObjectType: 'Opportunity',
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Opportunity deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredOppResult);
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
        if (message.type === "opportunityName")
            this.oppNameSearch = message.oppNameField;
        if (message.type === "opportunityAcc")
            this.oppAccountSearch = message.oppAccField;
        if (message.type === "opportunityStage")
            this.oppStageSearch = message.oppStageField;
        if (message.type === "opportunityClose")
            this.oppDateSearch = message.oppCloseField;
        if (message.type === "oppRender")
        {
            this.oppNameSearch = "";
            this.oppAccountSearch = "";
            this.oppStageSearch = "";
            this.oppDateSearch = "";
            this.renderedCallback();
        }
        if (message.type === "oppSubmit"){
            const myTimeout = setTimeout(refreshApex, 500, this.wiredResult);
        }
    }
    
    draftValues = [];

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

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
                    message: 'Opportunities updated',
                    variant: 'success'
                })
            );
            await refreshApex(this.contacts);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Opportunities',
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
        let parseData = JSON.parse(JSON.stringify(this.oppList));
        let keyVal = (a) => {
            return a[fieldName]
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x,y) => {
            x = keyVal(x) ? keyVal(x) : '';
            y = keyVal(y) ? keyVal(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.oppList = parseData;
    }
}
