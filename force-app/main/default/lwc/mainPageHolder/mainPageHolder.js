import { LightningElement } from 'lwc';
import FBC_LOGO from '@salesforce/resourceUrl/Logo';

export default class MainPageHolder extends LightningElement {
    displayAcc = true;
    displayOpp = false;
    displayOrd = false;
    displayCon = false;
    displayWO  = false;
    logo = FBC_LOGO;

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

}