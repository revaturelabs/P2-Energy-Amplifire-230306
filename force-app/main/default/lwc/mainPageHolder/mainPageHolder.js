import { LightningElement } from 'lwc';
import FBC_LOGO from '@salesforce/resourceUrl/Logo';


export default class MainPageHolder extends LightningElement {
    displayAcc = true;
    displayLea = true;
    displayOpp = false;
    displayOrd = false;
    displayCus = false;
    displayTec = false;
    displayWO  = false;
    logo = FBC_LOGO;

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

    timer1;
    timer2;
    displayProd = true;

    handleProdReset(){
        this.toggleProd();
        this.timer2 = setTimeout(() => {
            this.toggleProd();
          }, 300);
    }

    toggleProd(){
        this.displayProd = !this.displayProd;
    }
}