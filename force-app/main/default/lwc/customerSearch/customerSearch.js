import { LightningElement, wire } from 'lwc';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
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