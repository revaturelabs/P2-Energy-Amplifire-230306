import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import  { publish,MessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c'; 
import LEAD_OBJECT from '@salesforce/schema/Lead';
import STATUS_FIELD from '@salesforce/schema/Lead.Status';
import RATING_FIELD from '@salesforce/schema/Lead.Rating';
import NAME_FIELD from '@salesforce/schema/Lead.Name';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';

export default class AccountSearch extends LightningElement {
    companySearchTerm;
    ratingSearchTerm;
    nameSearchTerm;
    phoneSearchTerm;
    emailSearchTerm;
    statusSearchTerm;
    fields = [ NAME_FIELD, COMPANY_FIELD, PHONE_FIELD, EMAIL_FIELD, RATING_FIELD, STATUS_FIELD ];

    @wire(getObjectInfo, { objectApiName: LEAD_OBJECT })
    leadMetadata;

    @wire(MessageContext)
    messageContext;

    @wire(getPicklistValues,
        {
            recordTypeId: '$leadMetadata.data.defaultRecordTypeId', 
            fieldApiName: STATUS_FIELD
        }
    )
    statusOptions;

    @wire(getPicklistValues,
        {
            recordTypeId: '$leadMetadata.data.defaultRecordTypeId', 
            fieldApiName: RATING_FIELD
        }
    )
    ratingOptions;

    handleCompany(event) {
        const company = event.detail.value;
        const payload = {
            leadCompanyField: company,
            type: "leadCompany"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleRating(event) {
        const rating = event.detail.value;
        const payload = {
            leadRatingField: rating,
            type: "leadRating"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleName(event) {
        const name = event.detail.value;
        const payload = {
            leadNameField: name,
            type: "leadName"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }
    
     handlePhone(event) {
        const phone = event.detail.value;
        const payload = {
            leadPhoneField: phone,
            type: "leadPhone"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleEmail(event) {
        const email = event.detail.value;
        const payload = {
            leadEmailField: email,
            type: "leadEmail"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    } 

    handleStatus(event) {
        const status = event.detail.value;
        const payload = {
            leadStatusField: status,
            type: "leadStatus"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }
    create = false;
    
    handleCreate(event){
        this.create = !this.create;
    }
}