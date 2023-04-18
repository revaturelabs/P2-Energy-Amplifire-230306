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
        const payload = {
            nameField: name,
            type: "accname"
        }
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

// Import message service features required for publishing and the message channel
    handlePhone(event) {
        this.phoneSearchTerm = event.detail.value;
        const phone =  event.detail.value;
        const payload = {
            phoneField: phone,
            type: "accphone"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

    handleIndustry(event) {
        this.industrySearchTerm = event.detail.value;
        const industry =  event.detail.value;
        const payload = {
            industryField: industry,
            type: "accindustry"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
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

    create = true;
    timer1;
    timer2;

    handleSubmit(){
        console.log('submitting');
        const payload = {
            type: "accSubmit"
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