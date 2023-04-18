import { LightningElement , wire, track} from 'lwc';
/*import getOrderList from '@salesforce/apex/LWCHelper.getOrderList';*/
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import  { subscribe, MessageContext} from 'lightning/messageService';
import ORDER_SELECTED_CHANNEL from '@salesforce/messageChannel/orderSelected__c';
import ORDERITEM_OBJECT from '@salesforce/schema/OrderItem';
import DESCRIPTION_FIELD from '@salesforce/schema/OrderItem.Description';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class ProductList extends LightningElement {
    @wire(getObjectInfo, { objectApiName: ORDERITEM_OBJECT })
    orderItemMetadata;
    
    @track columns = [{
        label: 'Description',
        fieldName: 'descriptionValue',
        type: 'text',
        editable: false,
    },
    {
        label: 'Id',
        fieldName: 'id',
        type: 'text',
        editable: false,
    }
    ];
    
    @track error;
    @track records;
    whatever;
    wiredResult;
    
    @wire(getRelatedListRecords, {
        parentRecordId: '$whatever',
        relatedListId: 'OrderItems',
        fields: ['OrderItem.Description']
    })listInfo({ error, data }) {
        if (data) {
            this.wiredResult = data;
            console.log(data);
            this.records = data.records;
            this.records = this.records.map( item =>{
                item = {...item};
                if(item.fields.Description.value){
                    item['descriptionValue'] = item.fields.Description.value;
                    return item;
                }
                else{
                    item['descriptionValue'] = '';
                    return item;
                }
            }
            )
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            ORDER_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
          );
    }

    handleMessage(message) {console.log(message.orderIdField);
        //if (message.type === "orderId")
        this.whatever = message.orderIdField;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    selectedIds;

    getSelectedRec() {
        let selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        console.log(selectedRecords);
        if(selectedRecords.length > 0){
            console.log('selectedRecords are ', selectedRecords);
   
            let ids = '';
            selectedRecords.forEach(currentItem => {
                ids = ids + ',' + currentItem.id;
            });
            this.selectedIds = ids.replace(/^,/, '');
        }
    }

    async handleDelete() {
        console.log(this.selectedIds);
        await DELETE({
            idsToDelete: this.selectedIds, 
            sObjectType: 'OrderItem',
        })
        
            try {
                let idString = this.selectedIds;
                let ids = idString.split(',').map(item => {
                return {recordId: item};});
                console.log(ids);
                console.log(typeof this.selectedIds);
                await notifyRecordUpdateAvailable(ids);
                }
            catch(error) {console.log(error.message);}
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Product deleted',
                    variant: 'success'
                })
            );
            //return refreshApex(this.wiredResult);
            
    }
}