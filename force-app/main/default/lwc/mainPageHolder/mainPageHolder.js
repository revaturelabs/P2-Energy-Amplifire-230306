import { LightningElement } from 'lwc';
import FBC_LOGO from '@salesforce/resourceUrl/Logo';
import { registerRefreshContainer, unregisterRefreshContainer } from 'lightning/refresh';


export default class MainPageHolder extends LightningElement {
    displayAcc = true;
    displayLea = true;
    displayOpp = false;
    displayOrd = false;
    displayCus = false;
    displayTec = false;
    displayWO  = false;
    logo = FBC_LOGO;
    refreshHandlerID;

    refreshContainerID;
    connectedCallback() {
        this.refreshContainerID = registerRefreshContainer(this, this.refreshContainer);
    }

    disconnectedCallback() {
        unregisterRefreshContainer(this.refreshContainerID);
    }
    
    refreshContainer(refreshPromise) {
        console.log('refreshing');
        return refreshPromise.then((status) => {
            if (status === REFRESH_COMPLETE) {
                console.log('Done!');
            }
            else if (status === REFRESH_COMPLETE_WITH_ERRORS) {
               console.warn('Done, with issues refreshing some components');
            }
            else if (status === REFRESH_ERROR) {
               console.error('Major error with refresh.');
            }
         });
    }

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