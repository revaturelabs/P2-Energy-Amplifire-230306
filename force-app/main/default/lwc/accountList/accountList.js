import { LightningElement , wire, track} from 'lwc';
import getAccountList from '@salesforce/apex/LWCHelper.getAccountList';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import  { subscribe, MessageContext, createMessageContext } from 'lightning/messageService';
import NAME_SELECTED_CHANNEL from '@salesforce/messageChannel/nameSelected__c';

export default class LightningDatatableLWCExample extends LightningElement {
    @wire(MessageContext)
    messageContext;

    accNameSearch = '';
    accPhoneSearch = '';
    accIndustrySearch = '';
    accRatingSearch = '';

    subscribeToMessageChannel() {

        
        this.subscription = subscribe(
            this.messageContext,
            NAME_SELECTED_CHANNEL,
            (message) => this.handleRating(message)
          );
     /*   
        this.subscription = subscribe(
            this.messageContext,
            NAME_SELECTED_CHANNEL,
            (message) => this.handleMessage(message)
          );
*/

    
      }
      
 
    @track columns = [{
            label: 'Account name',
            fieldName: 'Name',
            type: 'text',
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'phone',
        },
        {
            label: 'Industry',
            fieldName: 'Industry',
            type: 'text',
        },
        {
            label: 'Rating',
            fieldName: 'Rating',
            type: 'text',
        }
    ];
 


    @track error;
    @track accList;

    @wire(getAccountList,
        {
            nameAccountSearchTerm: '$accNameSearch', 
            phoneAccountSearchTerm: '$accPhoneSearch',
            industryAccountSearchTerm: '$accIndustrySearch',
            ratingAccountSearchTerm: '$accRatingSearch',
        }
        )
    wiredAccounts({
        error,
        data
    }) {
        if (data) {
            this.accList = data;
        } else if (error) {
            this.error = error;
        }
    }

  handleMessage(message) {    
  this.accNameSearch = message.nameField; 
}

 handleRating(message) {
    if (message.type === "rating")
    this.accRatingSearch = message.ratingField;
    if (message.type === "name")
    this.accNameSearch = message.nameField;
    if (message.type === "industry")
    this.accIndustrySearch = message.industryField;
    if (message.type === "phone")
    this.accPhoneSearch = message.phoneField;
 }  

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

}
