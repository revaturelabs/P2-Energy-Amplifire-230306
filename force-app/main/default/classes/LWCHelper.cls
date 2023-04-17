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

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOppList(String name, String account, String stage){
        try {
            List<Opportunity> fullOppList = [SELECT Id, Name, Account.Name, StageName, CloseDate FROM Opportunity];
            List<Opportunity> temp = new List<Opportunity>();
            for(Opportunity opp : fullOppList){
                String oppName = opp.Name;
                String oppAccount = '';
                String oppStage = '';
                Date oppDate = NULL;
                if(opp.Account.Name != NULL){
                    oppAccount = (String)opp.Account.Name;
                }
                if(opp.StageName != NULL){
                    OppStage = (String)opp.StageName;
                }
                if(Opp.CloseDate != NULL){
                    OppDate = Opp.CloseDate;
                }
                if(OppName.containsIgnoreCase(Name) &&
                    OppAccount.containsIgnoreCase(Account) &&
                    OppStage.containsIgnoreCase(Stage)){
                        temp.add(opp);
                }
            }
            return temp;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getCustomerList(String first, String last, String phone, String email, String account){
        try {
            List<Contact> customers = [SELECT FirstName, LastName, Phone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Customer'];
            List<Contact> temp = new List<Contact>();
            for(Contact cust : customers){
                String custPhone = '';
                String custEmail = '';
                String custAccountName = '';
                String custFirstName = '';
                String custLastName = cust.LastName;
                if(cust.FirstName != NULL){
                    custFirstName = (String)cust.FirstName;
                }
                if(cust.Phone != NULL){
                    custPhone = (String)cust.Phone;
                }
                if(cust.Email != NULL){
                    custEmail = (String)cust.Email;
                }
                if(cust.AccountId != NULL){
                    custAccountName = cust.Account.Name;
                }
                if(custFirstName.containsIgnoreCase(first) && 
                    custLastName.containsIgnoreCase(last) &&
                    custPhone.containsIgnoreCase(phone) &&
                    custEmail.containsIgnoreCase(email) &&
                    custAccountName.ContainsIgnoreCase(account)){
                        temp.add(cust);
                }
            }
            return temp;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getTechList(String first, String last, String phone, String email, String account){
        try {
            List<Contact> customers = [SELECT FirstName, LastName, Phone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Technician'];
            List<Contact> temp = new List<Contact>();
            for(Contact cust : customers){
                String custPhone = '';
                String custEmail = '';
                String custAccountName = '';
                String custFirstName = '';
                String custLastName = cust.LastName;
                if(cust.FirstName != NULL){
                    custFirstName = (String)cust.FirstName;
                }
                if(cust.Phone != NULL){
                    custPhone = (String)cust.Phone;
                }
                if(cust.Email != NULL){
                    custEmail = (String)cust.Email;
                }
                if(cust.AccountId != NULL){
                    custAccountName = cust.Account.Name;
                }
                if(custFirstName.containsIgnoreCase(first) && 
                    custLastName.containsIgnoreCase(last) &&
                    custPhone.containsIgnoreCase(phone) &&
                    custEmail.containsIgnoreCase(email) &&
                    custAccountName.ContainsIgnoreCase(account)){
                        temp.add(cust);
                }
            }
            return temp;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Work_Order__c> getWOList(String name, String account, String productOwner){
        try{
            List<Work_Order__c> workOrders = [SELECT Name, Account__r.Name, Product_Owner__r.Name FROM Work_Order__c];
            List<Work_Order__c> temp = new List<Work_Order__c>();
            for(Work_Order__c wo : workOrders){
                String woName = wo.Name;
                String woAccount = '';
                String woPOwner = '';
                if(wo.Account__c != NULL){
                    woAccount = wo.Account__r.Name;
                }
                if(wo.Product_Owner__c != NULL){
                    woPOwner = wo.Product_Owner__r.Name;
                }
                if(woName.containsIgnoreCase(name) &&
                woAccount.containsIgnoreCase(account) &&
                woPOwner.containsIgnoreCase(productOwner)){
                    temp.add(wo);
                }
            }
            return temp;
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
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