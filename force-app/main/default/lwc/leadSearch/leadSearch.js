import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import STATUS_FIELD from '@salesforce/schema/Lead.Status';
import RATING_FIELD from '@salesforce/schema/Lead.Rating';

export default class AccountSearch extends LightningElement {
    companySearchTerm;
    ratingSearchTerm;
    nameSearchTerm;
    phoneSearchTerm;
    emailSearchTerm;
    statusSearchTerm;

    @wire(getObjectInfo, { objectApiName: LEAD_OBJECT })
    leadMetadata;

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

    handleEmail(event) {
        this.emailSearchTerm = event.detail.value;
    }

    handleStatus(event) {
        this.statusSearchTerm = event.detail.value;
    }
}