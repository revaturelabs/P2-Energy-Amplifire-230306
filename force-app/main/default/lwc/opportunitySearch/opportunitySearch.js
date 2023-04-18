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
    closeSearchTerm;
    fields = [ NAME_FIELD, ACCOUNT_FIELD, STAGE_FIELD, CLOSE_FIELD ];

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
        this.nameSearchTerm = event.detail.value;
        const name = event.detail.value;
        const payload = {
            oppNameField: name,
            type: "opportunityName"
            };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }  

    handleAccount(event) {
        this.accountSearchTerm = event.detail.value;
        const acc = event.detail.value;
        const payload = {
            oppAccField: acc,
            type: "opportunityAcc"
            };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);
    }  
    

    handleStage(event) {
        this.stageSearchTerm = event.detail.value;
        const stage = event.detail.value;
        const payload = {
            oppStageField: stage,
            type: "opportunityStage"
        };
        publish(this.messageContext,NAME_SELECTED_CHANNEL,payload);      
    }

    handleReset()
    {
        this.nameSearchTerm = "";
        this.stageSearchTerm = "";
        this.accountSearchTerm = "";
        const payload = {
          type: "oppRender"
       };
      publish(this.messageContext,NAME_SELECTED_CHANNEL,payload); 
    }

    create = true;
    timer1;
    timer2;

    handleSubmit(){
        console.log('submitting');
        const payload = {
            type: "oppSubmit"
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