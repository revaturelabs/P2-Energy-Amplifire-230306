import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import  { publish,MessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c'; 
import ORDER_OBJECT from '@salesforce/schema/Order';
import STATUS_FIELD from '@salesforce/schema/Order.Status';
import ACCOUNT_FIELD from '@salesforce/schema/Order.AccountId';
import START_FIELD from '@salesforce/schema/Order.EffectiveDate';

export default class AccountSearch extends LightningElement {
    numberSearchTerm;
    accountNameSearchTerm;
    effectiveDateSearchTerm;
    statusSearchTerm;
    totalAmountSearchTerm;
    fields = [ACCOUNT_FIELD, START_FIELD, STATUS_FIELD];

    @wire(getObjectInfo, { objectApiName: ORDER_OBJECT })
    orderMetadata;

    @wire(MessageContext)
    messageContext;

    @wire(getPicklistValues,
        {
            recordTypeId: '$orderMetadata.data.defaultRecordTypeId', 
            fieldApiName: STATUS_FIELD
        }
    )
    statusOptions;

    handleNumber(event) {
        this.numberSearchTerm = event.detail.value;
        const number = event.detail.value;
        const payload = {
            orderNumberField: number,
            type: "orderNumber"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleAccountName(event) {
        this.accountNameSearchTerm = event.detail.value;
        const account = event.detail.value;
        const payload = {
            orderAccountNameField: account,
            type: "orderAccount"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleEffectiveDate(event) {
        this.effectiveDateSearchTerm = event.detail.value;
        const start = event.detail.value;
        const payload = {
            orderEffectiveDateField: start,
            type: "orderStart"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }
    
     handleStatus(event) {
        this.statusSearchTerm = event.detail.value;
        const status = event.detail.value;
        const payload = {
            orderStatusField: status,
            type: "orderStatus"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleTotalAmount(event) {
        this.totalAmountSearchTerm = event.detail.value;
        const amount = event.detail.value;
        const payload = {
            orderTotalAmountField: amount,
            type: "orderAmount"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    } 
    create = false;
    
    handleCreate(event){
        this.create = !this.create;
    }

    numberSearchTerm;
    accountNameSearchTerm;
    effectiveDateSearchTerm;
    statusSearchTerm;
    totalAmountSearchTerm;

    handleReset() {
        this.accountNameSearchTerm = "";
        this.numberSearchTerm = "";
        this.statusSearchTerm = "";
        this.totalAmountSearchTerm = "";
        const payload = {
          type: "ordRender"
        };
       publish(this.messageContext,NAME_SELECTED_CHANNEL,payload); 
    }

    

    handleSubmit(){
        const submit =  true;
        const payload = {
            submitField: submit,
            type: "ordSubmit"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }
}