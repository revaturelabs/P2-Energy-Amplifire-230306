import { LightningElement, wire, track } from 'lwc';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';

import { getRecord } from "lightning/uiRecordApi";
import CONTACT_RECORDTYPE_FIELD from '@salesforce/schema/Contact.RecordTypeId';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class AccountSearch extends LightningElement {
    firstNameSearchTerm;
    lastNameSearchTerm;
    phoneSearchTerm;
    emailSearchTerm;
    accountSearchTerm;
    fields = [ FIRSTNAME_FIELD, LASTNAME_FIELD, PHONE_FIELD, EMAIL_FIELD, ACCOUNT_FIELD ];

    @track recordTypeId;
    @track error;
    @wire(getObjectInfo, {objectApiName: 'Contact'})
    getRecordType(result){
        if(result.data){
            console.log(result.data.recordTypeInfos);
            const recTypes = result.data.recordTypeInfos;
            this.recordTypeId = Object.keys(recTypes).find(rt => recTypes[rt].name === 'Technician');
            this.error = undefined;
            console.log(this.recordTypeId);
        }
        else if (result.error){
            this.error = result.error;
            this.recordTypeId = undefined;
        }
    }

    handleFirstName(event) {
        this.firstNameSearchTerm = event.detail.value;
    }

    handleLastName(event) {
        this.lastNameSearchTerm = event.detail.value;
    }

    handlePhone(event) {
        this.phoneSearchTerm = event.detail.value;
    }

    handleEmail(event) {
        this.emailSearchTerm = event.detail.value;
    }

    handleAccount(event) {
        this.accountSearchTerm = event.detail.value;
    }

    create = false;

    handleCreate(event){
        this.create = !this.create;
    }
}