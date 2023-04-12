import { LightningElement } from 'lwc';
import FBC_LOGO from '@salesforce/resourceUrl/Logo';
import LEAD_STATUS_FIELD from '@salesforce/schema/Lead.Status';
import LEAD_RATING_FIELD from '@salesforce/schema/Lead.Rating';
import LEAD_NAME_FIELD from '@salesforce/schema/Lead.Name';
import LEAD_COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import LEAD_PHONE_FIELD from '@salesforce/schema/Lead.Phone';
import LEAD_EMAIL_FIELD from '@salesforce/schema/Lead.Email';

export default class MainPageHolder extends LightningElement {
    displayAcc = true;
    displayOpp = false;
    displayOrd = false;
    displayCon = false;
    displayWO  = false;
    logo = FBC_LOGO;
    leadFields = [ LEAD_NAME_FIELD, LEAD_COMPANY_FIELD, LEAD_PHONE_FIELD, LEAD_EMAIL_FIELD, LEAD_RATING_FIELD, LEAD_STATUS_FIELD ];

    handleAcc() {
        this.displayAcc = true;
        this.displayOpp = false;
        this.displayOrd = false;
        this.displayCon = false;
        this.displayWO  = false;
    }

    handleOpp() {
        this.displayAcc = false;
        this.displayOpp = true;
        this.displayOrd = false;
        this.displayCon = false;
        this.displayWO  = false;
    }

    handleOrd() {
        this.displayAcc = false;
        this.displayOpp = false;
        this.displayOrd = true;
        this.displayCon = false;
        this.displayWO  = false;
    }

    handleCon() {
        this.displayAcc = false;
        this.displayOpp = false;
        this.displayOrd = false;
        this.displayCon = true;
        this.displayWO  = false;
    }

    handleWO() {
        this.displayAcc = false;
        this.displayOpp = false;
        this.displayOrd = false;
        this.displayCon = false;
        this.displayWO  = true;
    }

    createLead = false;
    createAccount = false;

    handleCreateLead(){
        this.createLead = !this.createLead;
    }

}