import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import  { publish,MessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c'; 
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import ACCOUNT_FIELD from '@salesforce/schema/Opportunity.AccountId';
import CLOSE_FIELD from '@salesforce/schema/Opportunity.CloseDate';

export default class OpportunitySearch extends LightningElement {
    nameSearchTerm;
    accountSearchTerm;
    stageSearchTerm;
    oppFields = [ NAME_FIELD, ACCOUNT_FIELD, STAGE_FIELD, CLOSE_FIELD ];

    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    oppMetadata;

    @wire(getPicklistValues,
        {
            recordTypeId: '$oppMetadata.data.defaultRecordTypeId', 
            fieldApiName: STAGE_FIELD
        }
    )
    stageOptions;

    @wire(MessageContext)
    messageContext;

    
handleName(event) {
    const name = event.detail.value;
    const payload = {
        oppNameField: name,
        type: "opportunityName"
        };
    publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
}  

    handleAccount(event) {
        const acc = event.detail.value;
        const payload = {
            oppAccField: acc,
            type: "opportunityAcc"
            };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }

    handleStage(event) {
        const stage = event.detail.value;
        const payload = {
            oppStageField: stage,
            type: "opportunityStage"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
        }

    createOpp = false;

    handleCreate(event){
       
        this.createOpp = !this.createOpp
    }
}