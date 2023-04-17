import { LightningElement, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Work_Order__c.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Work_Order__c.Account__c';
import PRODUCT_OWNER_FIELD from '@salesforce/schema/Work_Order__c.Product_Owner__c';
import  { publish,MessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c'; 

export default class AccountSearch extends LightningElement {
    @wire(MessageContext)
    messageContext;

    nameSearchTerm;
    accountSearchTerm;
    pOwnerSearchTerm;
    accountTimer;
    nameTimer;
    pOwnerTimer;

    fields = [ NAME_FIELD, ACCOUNT_FIELD, PRODUCT_OWNER_FIELD ];

    handleName(event) {
        const name = event.detail.value;
        this.nameSearchTerm = event.detail.value;
        const payload = {
            nameField: name,
            type: "workOrderName"
        };
        clearTimeout(this.nameTimer);
        this.nameTimer = setTimeout(publish, 300, this.messageContext, NAME_SELECTED_CHANNEL, payload);
        console.log(name);
    }

    handleAccount(event) {
        this.accountSearchTerm = event.detail.value;
        const account =  event.detail.value;
        const payload = {
            accountField: account,
            type: "workOrderAccount"
        };
        clearTimeout(this.accountTimer);
        this.accountTimer = setTimeout(publish, 300, this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    // Import message service features required for publishing and the message channel
    handlePOwner(event) {
        this.pOwnerSearchTerm = event.detial.value;
        const productOwner =  event.detail.value;
        const payload = {
            productOwnerField: productOwner,
            type: "workOrderPOwner"
        };
        clearTimeout(this.pOwnerTimer);
        this.pOwnerTimer = setTimeout(publish, 300, this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    create = false;

    handleCreate(event){
        this.create = !this.create;
    }

    handleSubmit(){
        const submit =  true;
        const payload = {
            submitField: submit,
            type: "workOrderSubmit"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleReset(){
        this.nameSearchTerm = '';
        this.accountSearchTerm = '';
        this.pOwnerSearchTerm = '';
        const payload = {
            type: "workOrderReset"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }
}