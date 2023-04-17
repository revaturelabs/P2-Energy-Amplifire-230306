import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import  { publish,MessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c'; 
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import RATING_FIELD from '@salesforce/schema/Account.Rating';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';

export default class AccountSearch extends LightningElement {
    industrySearchTerm;
    ratingSearchTerm;
    nameSearchTerm;
    phoneSearchTerm;
    nameTimer;
    phoneTimer;
    fields = [ NAME_FIELD, PHONE_FIELD, INDUSTRY_FIELD, RATING_FIELD ];
  //  start = true;

    @wire(MessageContext)
    messageContext;

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    accountMetadata;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId', 
            fieldApiName: INDUSTRY_FIELD
        }
    )
    industryOptions;

    resetValues() {
        this.industrySearchTerm = '';
        this.ratingSearchTerm = '';
        this.nameSearchTerm = "";
        this.phoneSearchTerm = "";
       // this.renderedCallback();
    }

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId', 
            fieldApiName: RATING_FIELD
        }
    )
    ratingOptions;

    handleRating(event) {
        this.ratingSearchTerm = event.detail.value;
      const rating = event.detail.value;
      const payload = {
         ratingField: rating,
         type: "accrating"
     };
    publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleName(event) {
        this.nameSearchTerm = event.detail.value;
        const name =  event.detail.value;
        console.log(name);
        const payload = {
            nameField: name,
            type: "accname"
        };
        clearTimeout(this.nameTimer);
        this.nameTimer = setTimeout(publish, 300, this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    // Import message service features required for publishing and the message channel
    handlePhone(event) {
        const phone =  event.detail.value;
        const payload = {
            phoneField: phone,
            type: "accphone"
        };
        clearTimeout(this.phoneTimer);
        this.phoneTimer = setTimeout(publish, 300, this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleIndustry(event) {
        const industry =  event.detail.value;
        const payload = {
            industryField: industry,
            type: "accindustry"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    create = false;

    handleCreate(event){
        this.create = !this.create;
    }

    handleReset()
    {  this.nameSearchTerm = "";
        this.phoneSearchTerm = "";
        this.industrySearchTerm = "";
        this.ratingSearchTerm = "";
        const payload = {
        
           type: "reRender"
       };
      publish(this.messageContext,NAME_SELECTED_CHANNEL,payload); 
    }
      
    handleSubmit(){
        const submit =  true;
        const payload = {
            submitField: submit,
            type: "accSubmit"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }
}