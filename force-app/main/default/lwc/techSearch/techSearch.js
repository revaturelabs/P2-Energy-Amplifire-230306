import { LightningElement, wire, track } from 'lwc';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';
import { publish, MessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c'; 
import { refreshApex } from '@salesforce/apex';

import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class AccountSearch extends LightningElement {
    firstNameSearchTerm;
    lastNameSearchTerm;
    phoneSearchTerm;
    emailSearchTerm;
    accountSearchTerm;
    fields = [ FIRSTNAME_FIELD, LASTNAME_FIELD, PHONE_FIELD, EMAIL_FIELD, ACCOUNT_FIELD ];

    @wire(MessageContext)
    messageContext;

    @track recordTypeId;
    @track error;
    @wire(getObjectInfo, {objectApiName: 'Contact'})
    getRecordType(result){
        this.wiredResult = result;
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
    
    handleReset() {
        this.firstNameSearchTerm = "";
        this.lastNameSearchTerm = "";
        this.phoneSearchTerm = "";
        this.emailSearchTerm = "";
        this.accountSearchTerm = "";
        const payload = {
            type: "techRender"
        };
       publish(this.messageContext, NAME_SELECTED_CHANNEL, payload); 
    }
    
    handleLastName(event) {
        this.lastNameSearchTerm = event.detail.value;
        const name =  event.detail.value;
        const payload = {
            techlnameField: name,
            type: "techlname"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleFirstName(event) {
        this.firstNameSearchTerm = event.detail.value;
        const name =  event.detail.value;
        const payload = {
            techfnameField: name,
            type: "techfname"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handlePhone(event) {
        this.phoneSearchTerm = event.detail.value;
        const name =  event.detail.value;
        const payload = {
            techPhoneField: name,
            type: "techPhone"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleEmail(event) {
        this.emailSearchTerm = event.detail.value;
        const name =  event.detail.value;
        const payload = {
            techEmailField: name,
            type: "techEmail"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleAccount(event) {
        this.accountSearchTerm = event.detail.value;
        const name =  event.detail.value;
        const payload = {
            techAccountField: name,
            type: "techAccount"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    create = true;
    timer1;
    timer2;

    handleSubmit(){
        console.log('submitting');
        const payload = {
            type: "techSubmit"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
        this.timer1 = setTimeout(() => {
            this.toggleCreate();
          }, 5000);
        this.timer2 = setTimeout(() => {
            this.toggleCreate();
          }, 4700);;
    }

    toggleCreate(){
        this.create = !this.create;
    }
}