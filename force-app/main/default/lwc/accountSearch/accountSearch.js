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

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId', 
            fieldApiName: RATING_FIELD
        }
    )
    ratingOptions;

    handleRating(event) {
      const rating = event.detail.value;
      const payload = {
         ratingField: rating,
         type: "accrating"
     };
    publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);

    }

    handleName(event) {
        const name =  event.detail.value;
        const payload = {
            nameField: name,
            type: "accname"
        };
        publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
    }

// Import message service features required for publishing and the message channel
handlePhone(event) {
    const phone =  event.detail.value;
    const payload = {
        phoneField: phone,
        type: "accphone"
    };
    publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
}

handleIndustry(event) {
    const industry =  event.detail.value;
    const payload = {
        industryField: industry,
        type: "accindustry"
    };
    publish(this.messageContext, NAME_SELECTED_CHANNEL, payload);
}

    handleCreate(event){
        this.create = !this.create;
    }
}