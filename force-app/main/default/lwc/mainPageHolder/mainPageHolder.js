import { LightningElement } from 'lwc';
import FBC_LOGO from '@salesforce/resourceUrl/Logo';
import LEAD_STATUS_FIELD from '@salesforce/schema/Lead.Status';
import LEAD_RATING_FIELD from '@salesforce/schema/Lead.Rating';
import LEAD_NAME_FIELD from '@salesforce/schema/Lead.Name';
import LEAD_COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import LEAD_PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import LEAD_EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import ACCOUNT_RATING_FIELD from '@salesforce/schema/Account.Rating';
import OPPORTUNITY_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPPORTUNITY_ACCOUNT_FIELD from '@salesforce/schema/Opportunity.Account.Name';
import OPPORTUNITY_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPPORTUNITY_CLOSE_FIELD from '@salesforce/schema/Opportunity.CloseDate';

export default class MainPageHolder extends LightningElement {
    displayAcc = true;
    displayLea = true;
    displayOpp = false;
    displayOrd = false;
    displayCus = false;
    displayTec = false;
    displayWO  = false;
    logo = FBC_LOGO;
    leadFields = [ LEAD_NAME_FIELD, LEAD_COMPANY_FIELD, LEAD_PHONE_FIELD, LEAD_EMAIL_FIELD, LEAD_RATING_FIELD, LEAD_STATUS_FIELD ];
    accountFields = [ ACCOUNT_NAME_FIELD, ACCOUNT_PHONE_FIELD, ACCOUNT_INDUSTRY_FIELD, ACCOUNT_RATING_FIELD ];
    oppFields = [ OPPORTUNITY_NAME_FIELD, OPPORTUNITY_ACCOUNT_FIELD, OPPORTUNITY_STAGE_FIELD, OPPORTUNITY_CLOSE_FIELD ];

    handleAcc() {
        this.displayAcc = !this.displayAcc
    }

    handleLea(){
        this.displayLea = !this.displayLea
    }

    handleOpp() {
        this.displayOpp = !this.displayOpp
    }

    handleOrd() {
        this.displayOrd = !this.displayOrd
    }

    handleCus() {
        this.displayCus = !this.displayCus
    }

    handleTec(){
        this.displayTec = !this.displayTec
    }

    handleWO() {
        this.displayWO  = !this.displayWO
    }

    createLead = false;
    createAccount = false;
    createOpp = false;

    handleCreateLead(){
        this.createLead = !this.createLead;
    }

    handleCreateAccount(){
        this.createAccount = !this.createAccount;
    }

    handleCreateOpp(){
        this.createOpp = !this.createOpp;
    }

}