import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { publish,MessageContext } from 'lightning/messageService';
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
        this.companySearchTerm = event.detail.value;
        const company = event.detail.value;
        const payload = {
            leadCompanyField: company,
            type: "leadCompany"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleRating(event) {
        this.ratingSearchTerm = event.detail.value;
        const rating = event.detail.value;
        const payload = {
            leadRatingField: rating,
            type: "leadRating"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleName(event) {
        this.nameSearchTerm = event.detail.value;
        const name = event.detail.value;
        const payload = {
            leadNameField: name,
            type: "leadName"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }
    
     handlePhone(event) {
        this.phoneSearchTerm = event.detail.value;
        const phone = event.detail.value;
        const payload = {
            leadPhoneField: phone,
            type: "leadPhone"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleEmail(event) {
        this.emailSearchTerm = event.detail.value;
        const email = event.detail.value;
        const payload = {
            leadEmailField: email,
            type: "leadEmail"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    } 

    handleStatus(event) {
        this.statusSearchTerm = event.detail.value;
        const status = event.detail.value;
        const payload = {
            leadStatusField: status,
            type: "leadStatus"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleReset()
    {
        this.nameSearchTerm = "";
        this.phoneSearchTerm = "";
        this.statusSearchTerm = "";
        this.ratingSearchTerm = "";
        this.emailSearchTerm = "";
        this.companySearchTerm =  "";
        const payload = {
            type: "renderLeads"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload); 
    }

    create = true;
    timer1;
    timer2;

    handleSubmit(){
        console.log('submitting');
        const payload = {
            type: "leadSubmit"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
        this.timer1 = setTimeout(() => {
            this.toggleCreate();
          }, 3000);
        this.timer2 = setTimeout(() => {
            this.toggleCreate();
          }, 2700);;
    }

    toggleCreate(){
        this.create = !this.create;
    }
}