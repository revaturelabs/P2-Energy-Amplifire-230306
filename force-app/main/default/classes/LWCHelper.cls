public with sharing class LWCHelper {

    @auraEnabled(cacheable=true)
    public static List<Account> getAccountList(String nameAccountSearchTerm, String phoneAccountSearchTerm, 
                                                    String industryAccountSearchTerm, String ratingAccountSearchTerm){
        
        List<Account> accList = [SELECT Id, Name, Phone, Industry, Rating FROM Account LIMIT 50000];
        List<account> temp = new List<Account>();
        for(Account acc : accList){
            String acctPhone = '';
            String acctIndustry = '';
            String acctRating = '';
            String acctName = acc.Name;
            if(acc.Phone != NULL){
                AcctPhone = (String)acc.Phone;
            }
            if(acc.Industry != NULL){
                AcctIndustry = (String)acc.Industry;
            }
            if(acc.Rating != NULL){
                AcctRating = (String)acc.Rating;
            }
            if(AcctName.containsIgnoreCase(NameAccountSearchTerm) 
                && AcctPhone.containsIgnoreCase(PhoneAccountSearchTerm) 
                && AcctIndustry.containsIgnoreCase(IndustryAccountSearchTerm)
                && AcctRating.ContainsIgnoreCase(RatingAccountSearchTerm)){
                    temp.add(acc);
            }
        }       
        return temp;
    }

    @auraEnabled(cacheable=true)
    public static List<Lead> getLeadList(String nameLeadSearchTerm, String companyLeadSearchTerm, String phoneLeadSearchTerm, 
    String emailLeadSearchTerm, String ratingLeadSearchTerm, String statusLeadSearchTerm){
        List<Lead> leadList = [SELECT Id, Name, Company, Phone, Email, Rating, Status FROM Lead LIMIT 50000];
        List<Lead> temp = new List<Lead>();
        for(Lead le : leadList){
            String leadPhone = '';
            String leadCompany = '';
            String leadRating = '';
            String leadName = Le.Name;
            String leadStatus = '';
            String leadEmail = '';
            if(le.Phone != NULL){
                leadPhone = (String)Le.Phone;
            }
            if(le.Company != NULL){
                leadCompany = (String)Le.Company;
            }
            if(le.Rating != NULL){
                leadRating = (String)Le.Rating;
            }
            if(le.Status != NULL){
                leadStatus = (String)Le.Status;
            }
            if(le.Email != NULL){
                leadEmail = (String)Le.Email;
            }
            if(LeadName.containsIgnoreCase(nameLeadSearchTerm) && 
                LeadPhone.containsIgnoreCase(phoneLeadSearchTerm) &&
                LeadCompany.containsIgnoreCase(companyLeadSearchTerm) &&
                LeadEmail.containsIgnoreCase(emailLeadSearchTerm) &&
                LeadRating.ContainsIgnoreCase(ratingLeadSearchTerm) &&
                LeadStatus.ContainsIgnoreCase(statusLeadSearchTerm)){
                    temp.add(le);
                }
        }
        return temp;
    }

    @AuraEnabled
    public static void deleter(String idsToDelete, String sObjectType){
        try {
            List<String> stringIdList = idsToDelete.split(',', 0);
            String query = 'SELECT Id FROM ' + sObjectType + ' WHERE Id IN :stringIdList';
            List<sObject> baleeted = Database.query(query);
            Delete baleeted;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}