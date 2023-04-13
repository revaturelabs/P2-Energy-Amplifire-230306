import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
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

    handleIndustry(event) {
        this.industrySearchTerm = event.detail.value;
        const selectedEvent = new CustomEvent("progressvaluechange", {detail: this.progressValue});
        this.dispatchEvent(selectedEvent)
    }

    handleRating(event) {
        this.ratingSearchTerm = event.detail.value;
    }

    handleName(event) {
        this.nameSearchTerm = event.detail.value;
    }

    handlePhone(event) {
        this.phoneSearchTerm = event.detail.value;
    }
    create = false;

    handleCreate(event){
        this.create = !this.create;
    }
}