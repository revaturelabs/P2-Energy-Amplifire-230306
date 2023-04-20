import { LightningElement , wire, track} from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import DELETE from '@salesforce/apex/LWCHelper.deleter';
import  { subscribe, publish, MessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import ORDER_SELECTED_CHANNEL from '@salesforce/messageChannel/orderSelected__c';
import ORDERITEM_OBJECT from '@salesforce/schema/OrderItem';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { notifyRecordUpdateAvailable, updateRecord } from 'lightning/uiRecordApi';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import getProductOptions from '@salesforce/apex/LWCHelper.getProductOptions';
import createProduct from '@salesforce/apex/LWCHelper.createProduct';
import { RefreshEvent } from 'lightning/refresh';

export default class ProductList extends LightningElement {
    @wire(getObjectInfo, { objectApiName: ORDERITEM_OBJECT })
    orderItemMetadata;


    @wire(MessageContext)
    messageContext;
    
    @track columns = [
    {
        label: 'Product Name',
        fieldName: 'productName',
        type: 'text',
        editable: false,
        sortable: true,
    },
    {
        label: 'Unit Price',
        fieldName: 'unitpriceValue',
        type: 'currency',
        editable: false,
        sortable: true,
    },
    {
        label: 'Quantity',
        fieldName: 'quantityValue',
        type: 'number',
        editable: true,
        sortable: true,
    },
    {
        label: 'Total Price',
        fieldName: 'totalpriceValue',
        type: 'currency',
        editable: false,
        sortable: true,
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
                const payload = {
                    type: "ordSubmit"
                };
                publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
                }
            catch(error) {console.log(error.message);}
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Products deleted',
                    variant: 'success'
                })
            ); 
    }

    async handleSave(event) {
        const records = event.detail.draftValues.slice().map((draftValue) => {
            let fields = {};
            for (let key in draftValue){
                switch (key){
                    case 'quantityValue' : fields['Quantity'] = draftValue[key];
                    break;
                    case 'id' : fields['Id'] = draftValue[key];
                    break;
                }
            }
            return { fields };
        });
        records.forEach(item => {
            console.log(JSON.parse(JSON.stringify(item)));
          });
        console.log(records);

        try {
            const recordUpdatePromises = records.map((record) =>
                updateRecord(record)
            );
            await Promise.all(recordUpdatePromises);
            const recordIds = records.map((record) =>
                {return {recordId: record.Id};}
            );

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Products updated',
                    variant: 'success'
                })
            );
            await notifyRecordUpdateAvailable(recordIds);

            const payload = {
                type: "ordSubmit"
            };
            publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading Products',
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
        let parseData = JSON.parse(JSON.stringify(this.records));
        let keyVal = (a) => {
            return a[fieldName]
        };
        let isReverse = direction === 'asc' ? 1 : -1;
        parseData.sort((x,y) => {
            x = keyVal(x) ? keyVal(x) : '';
            y = keyVal(y) ? keyVal(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.records = parseData;
    }

    productOptions = [];
    create = false;
    Opt;

    @wire(getProductOptions)
    pOptions(result) {
        console.log('pOptions:');
        console.log(result.data);
        if (result.data) {
            console.log('in if statement');
            this.productOptions = result.data.map((item) =>{
                return { value: item.Id, label: item.Name };
            });
            console.log('my products Options are:')
            this.productOptions.forEach( item =>
                console.log(JSON.parse(JSON.stringify(item))))
            this.error = undefined;
        } else if (result.error) {
            console.log('error in pOptions');
            this.error = result.error;
            this.oppList = undefined;
        }
    } 

    selectedIds;
    product;
    quantity;

    handleCreate(){
        this.create = !this.create;
    }

    handleProductChange(event){
        this.product = event.detail.value;
    }

    handleQuantity(event){
        this.quantity = event.detail.value;
    }

    async handleNewProduct(){
        console.log(this.whatever);
        console.log(this.product);
        console.log(this.quantity);
        const recordId = await createProduct({
            OrderId: this.whatever,
            ProductId: this.product,
            Quant: this.quantity,
        })

        const payload = {
            type: "ordSubmit"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
        const recordIds = this.records.map((record) =>
                {return {recordId: record.id};}
            );
        await notifyRecordUpdateAvailable(recordIds);
        this.records.forEach(item => {
            console.log(JSON.parse(JSON.stringify(item)));
          });
        console.log(records);
        
    }
}