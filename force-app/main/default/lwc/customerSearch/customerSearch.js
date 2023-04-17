import { LightningElement, wire } from 'lwc';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import  { publish, MessageContext} from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';

export default class AccountSearch extends LightningElement {
    firstNameSearchTerm;
    lastNameSearchTerm;
    phoneSearchTerm;
    emailSearchTerm;
    accountSearchTerm;
    fields = [ FIRSTNAME_FIELD, LASTNAME_FIELD, PHONE_FIELD, EMAIL_FIELD, ACCOUNT_FIELD ];


    @wire(MessageContext)
    messageContext;


    handleLastName(event) {
        const name =  event.detail.value;
        const payload = {
            lnameField: name,
            type: "cuslname"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleFirstName(event) {
        const name =  event.detail.value;
        const payload = {
            fnameField: name,
            type: "cusfname"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }


    handlePhone(event) {
        const name =  event.detail.value;
        const payload = {
            cusPhoneField: name,
            type: "cusphone"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleEmail(event) {
        const name =  event.detail.value;
        const payload = {
            cusEmailField: name,
            type: "cusemail"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleAccount(event) {
        const name =  event.detail.value;
        const payload = {
            cusAccountField: name,
            type: "cusaccount"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
        
    }

    handleReset()
    {
       
        this.firstNameSearchTerm = "";
        this.lastNameSearchTerm = "";
        this.emailSearchTerm = "";
        this.phoneSearchTerm = "";
        this.accountSearchTerm = "";
        
    }

    create = false;

    handleCreate(event){
        this.create = !this.create;
    }
}