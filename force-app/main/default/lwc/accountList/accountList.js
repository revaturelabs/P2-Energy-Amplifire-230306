import { LightningElement , wire, track} from 'lwc';
import getAccountList from '@salesforce/apex/LWCAccountHelper.getAccountList';
export default class LightningDatatableLWCExample extends LightningElement {
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
 
    accNameSearch = '';
    accPhoneSearch = '';
    accIndustrySearch = '';
    accRatingSearch = '';

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
}
