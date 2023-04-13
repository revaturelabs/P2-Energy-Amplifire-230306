import { LightningElement, wire } from 'lwc';
import NAME_FIELD from '@salesforce/schema/Work_Order__c.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Work_Order__c.Account__c';
import PRODUCT_OWNER_FIELD from '@salesforce/schema/Work_Order__c.Product_Owner__c';

export default class AccountSearch extends LightningElement {
    nameSearchTerm;
    accountSearchTerm;
    pOwnerSearchTerm;

    fields = [ NAME_FIELD, ACCOUNT_FIELD, PRODUCT_OWNER_FIELD ];

    handleName(event) {
        this.nameSearchTerm = event.detail.value;
    }

    handleAccount(event) {
        this.accountSearchTerm = event.detail.value;
    }

    handlePOwner(event) {
        this.pOwnerSearchTerm = event.detail.value;
    }

    create = false;

    handleCreate(event){
        this.create = !this.create;
    }
}