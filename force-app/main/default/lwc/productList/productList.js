import { LightningElement , wire, track} from 'lwc';
/*import getOrderList from '@salesforce/apex/LWCHelper.getOrderList';*/
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import  { subscribe, MessageContext} from 'lightning/messageService';
import ORDER_SELECTED_CHANNEL from '@salesforce/messageChannel/orderSelected__c';
import ORDERITEM_OBJECT from '@salesforce/schema/OrderItem';
import PRODUCT_FIELD from '@salesforce/schema/OrderItem.Product2Id';
import QUANTITY_FIELD from '@salesforce/schema/OrderItem.Quantity';
import ORDER_FIELD from '@salesforce/schema/OrderItem.OrderId';
import PRICEBOOK_FIELD from '@salesforce/schema/OrderItem.PricebookEntryId'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class ProductList extends LightningElement {
    @wire(getObjectInfo, { objectApiName: ORDERITEM_OBJECT })
    orderItemMetadata;
    fields = [ PRODUCT_FIELD, QUANTITY_FIELD, ORDER_FIELD, PRICEBOOK_FIELD ];
    
    @track columns = [
    {
        label: 'Product Name',
        fieldName: 'productName',
        type: 'text',
        editable: false,
    },
    {
        label: 'Unit Price',
        fieldName: 'unitpriceValue',
        type: 'currency',
        editable: false,
    },
    {
        label: 'Quantity',
        fieldName: 'quantityValue',
        type: 'number',
        editable: true,
    },
    {
        label: 'Total Price',
        fieldName: 'totalpriceValue',
        type: 'currency',
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
        fields: ['OrderItem.Product2.Name', 'OrderItem.UnitPrice', 'OrderItem.Quantity', 'OrderItem.TotalPrice']
    })listInfo({ error, data }) {
        if (data) {
            this.wiredResult = data;
            console.log(data);
            this.records = data.records;
            console.log(this.records);
            this.records = this.records.map( item =>{
                item = {...item};
                if(item.fields.Product2.value.fields.Name.value){
                    item['productName'] = item.fields.Product2.value.fields.Name.value;
                }
                else{
                    item['productName'] = '';
                }
                if(item.fields.Quantity.value){
                    item['quantityValue'] = item.fields.Quantity.value;
                }
                else{
                    item['quantityValue'] = '';
                }
                if(item.fields.UnitPrice.value){
                    item['unitpriceValue'] = item.fields.UnitPrice.value;
                }
                else{
                    item['unitpriceValue'] = '';
                }
                if(item.fields.TotalPrice.value){
                    item['totalpriceValue'] = item.fields.TotalPrice.value;
                }
                else{
                    item['totalpriceValue'] = '';
                }

                return item;
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
        if(message.orderIdField == 'reset'){
            this.whatever;
        }
        else{
            this.whatever = message.orderIdField;
        }
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
    }

    create = false;

    handleCreate(){
        this.create = !this.create;
    }

    handleNew(){

    }
}