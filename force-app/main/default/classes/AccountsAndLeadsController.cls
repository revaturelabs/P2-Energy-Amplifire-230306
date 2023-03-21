public with sharing class AccountsAndLeadsController {
    
    public List<Account> AccountList { get; set; }
    public List<Lead> LeadList { get; set; }
    
    public String NameAccountSearchTerm { get; set; }
    public String PhoneAccountSearchTerm { get; set; }
    public String IndustryAccountSearchTerm { get; set; }
    public String RatingAccountSearchTerm { get; set; }
    
    public String NameLeadSearchTerm { get; set; }
    public String CompanyLeadSearchTerm { get; set; }
    public String PhoneLeadSearchTerm { get; set; }
    public String EmailLeadSearchTerm { get; set; }
    public String RatingLeadSearchTerm { get; set; }
    public String StatusLeadSearchTerm { get; set; }
    
    public List<Account> SearchedAccountList { get{
        List<Account> temp = new List<Account>();
        for(Account acc : AccountList){
            String AcctPhone = '';
            String AcctIndustry = '';
            String AcctRating = '';
            String AcctName = acc.Name;
            if(acc.Phone != NULL){
                AcctPhone = (String)acc.Phone;
            }
            if(acc.Industry != NULL){
                AcctIndustry = (String)acc.Industry;
            }
            if(acc.Rating != NULL){
                AcctRating = (String)acc.Rating;
            }
            if(AcctName.containsIgnoreCase(NameAccountSearchTerm)){
                if(AcctPhone.containsIgnoreCase(PhoneAccountSearchTerm)){
                    if(AcctIndustry.containsIgnoreCase(IndustryAccountSearchTerm)){
                        if(AcctRating.ContainsIgnoreCase(RatingAccountSearchTerm)){
                            temp.add(acc);
                        }
                    }
                }
            }
        }
        return temp;
    }}
    
    public String LeadSearchTerm { get; set; }
    public List<Lead> SearchedLeadList { get{
        List<Lead> temp = new List<Lead>();
        for(Lead Le : LeadList){
            String LeadPhone = '';
            String LeadCompany = '';
            String LeadRating = '';
            String LeadName = Le.Name;
            String LeadStatus = '';
            String LeadEmail = '';
            if(Le.Phone != NULL){
                LeadPhone = (String)Le.Phone;
            }
            if(Le.Company != NULL){
                LeadCompany = (String)Le.Company;
            }
            if(Le.Rating != NULL){
                LeadRating = (String)Le.Rating;
            }
            if(Le.Status != NULL){
                LeadStatus = (String)Le.Status;
            }
            if(Le.Company != NULL){
                LeadEmail = (String)Le.Email;
            }
            if(LeadName.containsIgnoreCase(NameLeadSearchTerm)){
                if(LeadPhone.containsIgnoreCase(PhoneLeadSearchTerm)){
                    if(LeadCompany.containsIgnoreCase(CompanyLeadSearchTerm)){
                        if(LeadEmail.containsIgnoreCase(EmailLeadSearchTerm)){
                            if(LeadRating.ContainsIgnoreCase(RatingLeadSearchTerm)){
                                if(LeadStatus.ContainsIgnoreCase(StatusLeadSearchTerm)){
                                   temp.add(le);
                                }
                            }
                        }
                    }
                }
            }
        }
        return temp;
    }}
    
    public AccountsAndLeadsController(){
        LeadList = [SELECT Name, Company, Email, Phone, Rating, Status FROM Lead];
        AccountList = [SELECT Name, Phone, Industry, Rating FROM Account];
        NameAccountSearchTerm = '';
        PhoneAccountSearchTerm = '';
        IndustryAccountSearchTerm = '';
        RatingAccountSearchTerm = '';
        NameLeadSearchTerm = '';
    	CompanyLeadSearchTerm = '';
    	PhoneLeadSearchTerm = '';
    	EmailLeadSearchTerm = '';
    	RatingLeadSearchTerm = '';
    	StatusLeadSearchTerm = '';
    }
    
    public PageReference OpportunitiesPage(){
        PageReference nextPage = Page.AccountsAndLeads;
        return nextPage;
    }
    
    public PageReference ContactsPage(){
        PageReference nextPage = Page.AccountsAndLeads;
        return nextPage;
    }
    
    public PageReference OrdersPage(){
        PageReference nextPage = Page.AccountsAndLeads;
        return nextPage;
    }
    
    public PageReference AccountsAndLeadsPage(){
        PageReference nextPage = Page.AccountsAndLeads;
        return nextPage;
    }
    
    public PageReference WorkOrdersPage(){
        PageReference nextPage = Page.AccountsAndLeads;
        return nextPage;
    }
    
    public void SaveAccount(){
        Account newAccount = new Account(
        	Name = NameAccountSearchTerm, 
        	Phone = PhoneAccountSearchTerm,
        	Industry = IndustryAccountSearchTerm,
        	Rating = RatingAccountSearchTerm);
        insert newAccount;
    }
    
    public void UpdateAccount(){
        update AccountList;
    }
    
    public void SaveLead(){
        String LeadsFirstName;
        String LeadsLastName;
        if(NameLeadSearchTerm.contains(' ')){
            Integer index = NameLeadSearchTerm.indexOf(' ');
            LeadsFirstName = NameLeadSearchTerm.substring(0, index);
            LeadsLastName = NameLeadSearchTerm.substring(index+1);
        }
        Else{
            LeadsLastName = NameLeadSearchTerm;
        }
        Lead newLead = new Lead(
            FirstName = LeadsFirstName,
            LastName = LeadsLastName,
        	Phone = PhoneLeadSearchTerm,
        	Company = CompanyLeadSearchTerm,
        	Rating = RatingLeadSearchTerm,
        	Email = EmailLeadSearchTerm,
        	Status = StatusLeadSearchTerm);
        insert newLead;
    }
    
    public void UpdateLead(){
        update LeadList;
    }
    
    public boolean LeadAccess(){
        return Schema.sObjectType.Lead.isAccessible();
    }
    
    public boolean LeadEditAccess(){
        return Schema.sObjectType.Lead.isUpdateable();
    }
    
    public boolean AccountAccess(){
        return Schema.sObjectType.Account.isAccessible();
    }
    
    public boolean AccountEditAccess(){
        return Schema.sObjectType.Account.isUpdateable();
    }
}