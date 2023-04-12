public with sharing class AccountsAndLeadsController {
    
    public List<Account> AccountList { get; set; }
    public List<Lead> LeadList { get; set; }
    
    public String NameAccountSearchTerm { get; set; }
    public String PhoneAccountSearchTerm { get; set; }
    public Account EmptyAccount { get; set; }
    
    public String NameLeadSearchTerm { get; set; }
    public String CompanyLeadSearchTerm { get; set; }
    public String PhoneLeadSearchTerm { get; set; }
    public String EmailLeadSearchTerm { get; set; }
    public String RatingLeadSearchTerm { get; set; }
    public String StatusLeadSearchTerm { get; set; }
    
    public List<cAccount> cAccountList { get; set; }
    public List<cAccount> SearchedAccountList { get{
        List<cAccount> temp = new List<cAccount>();
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
            if(EmptyAccount.Industry == NULL){
                EmptyAccount.Industry = '';
            }
            if(EmptyAccount.Rating == NULL){
                EmptyAccount.Rating = '';
            }
            if(AcctName.containsIgnoreCase(NameAccountSearchTerm)){
                if(AcctPhone.containsIgnoreCase(PhoneAccountSearchTerm)){
                    if(AcctIndustry.containsIgnoreCase(EmptyAccount.Industry)){
                        if(AcctRating.ContainsIgnoreCase(EmptyAccount.Rating)){
                            temp.add(new cAccount(acc));
                        }
                    }
                }
            }
        }
        cAccountList = temp;
        return temp;
    }}
    
    public List<cLead> cLeadList { get; set; }
    public List<cLead> SearchedLeadList { get{
        List<cLead> temp = new List<cLead>();
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
            if(Le.Email != NULL){
                LeadEmail = (String)Le.Email;
            }
            if(LeadName.containsIgnoreCase(NameLeadSearchTerm)){
                if(LeadPhone.containsIgnoreCase(PhoneLeadSearchTerm)){
                    if(LeadCompany.containsIgnoreCase(CompanyLeadSearchTerm)){
                        if(LeadEmail.containsIgnoreCase(EmailLeadSearchTerm)){
                            if(LeadRating.ContainsIgnoreCase(RatingLeadSearchTerm)){
                                if(LeadStatus.ContainsIgnoreCase(StatusLeadSearchTerm)){
                                    temp.add(new cLead(le));
                                }
                            }
                        }
                    }
                }
            }
        }
        cLeadList = temp;
        return temp;
    }}
    
    public AccountsAndLeadsController(){
        LeadList = [SELECT Name, Company, Email, Phone, Rating, Status FROM Lead];
        AccountList = [SELECT Name, Phone, Industry, Rating FROM Account];
        NameAccountSearchTerm = '';
        PhoneAccountSearchTerm = '';
        NameLeadSearchTerm = '';
        CompanyLeadSearchTerm = '';
        PhoneLeadSearchTerm = '';
        EmailLeadSearchTerm = '';
        RatingLeadSearchTerm = '';
        StatusLeadSearchTerm = '';
        cAccountList = new List<cAccount>();
        cLeadList = new List<cLead>();
        EmptyAccount = new Account(
            Name = '',
            Phone = '',
            Industry = '',
            Rating = '');
    }
    
    public PageReference OpportunitiesPage(){
        PageReference nextPage = Page.Opportunities;
        return nextPage;
    }
    
    public PageReference ContactsPage(){
        PageReference nextPage = Page.ContactsAndTechs;
        return nextPage;
    }
    
    public PageReference OrdersPage(){
        PageReference nextPage = Page.OrderswithProducts;
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
    
    public PageReference SaveAccount(){
        Account newAccount = new Account(
            Name = NameAccountSearchTerm, 
            Phone = PhoneAccountSearchTerm,
            Industry = EmptyAccount.Industry,
            Rating = EmptyAccount.Rating);
        insert newAccount;
        AccountList = [SELECT Name, Phone, Industry, Rating FROM Account];
        NameAccountSearchTerm = '';
        PhoneAccountSearchTerm = '';
        EmptyAccount = new Account();
        PageReference nextPage = Page.AccountsAndLeads;
        return nextPage;
        }
    
    public PageReference UpdateAccount(){
        update AccountList;
        PageReference nextPage = Page.AccountsAndLeads;
        AccountList = [SELECT Name, Phone, Industry, Rating FROM Account];
        return nextPage;
    }
    
    public PageReference DeleteAccount(){
        List<Account> AccountsToDelete = new List<Account>();
        for(cAccount cAcc : cAccountList){
            if(cAcc.selected == true){
                AccountsToDelete.add(cAcc.acc);
            }
        }
        delete AccountsToDelete;
        PageReference nextPage = Page.AccountsAndLeads;
        AccountList = [SELECT Name, Phone, Industry, Rating FROM Account];
        return nextPage;
    }
    
    public PageReference DeleteLead(){
        List<Lead> LeadsToDelete = new List<Lead>();
        for(cLead cLe : cLeadList){
            if(cLe.selected == true){
                LeadsToDelete.add(cLe.le);
            }
        }
        delete LeadsToDelete;
        PageReference nextPage = Page.AccountsAndLeads;
        LeadList = [SELECT Name, Company, Email, Phone, Rating, Status FROM Lead];
        return nextPage;
    }
    
    public PageReference SaveLead(){
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
        PageReference nextPage = Page.AccountsAndLeads;
        LeadList = [SELECT Name, Company, Email, Phone, Rating, Status FROM Lead];
        return nextPage;
    }
    
    public PageReference UpdateLead(){
        update LeadList;
        PageReference nextPage = Page.AccountsAndLeads;
        LeadList = [SELECT Name, Company, Email, Phone, Rating, Status FROM Lead];
        return nextPage;
    }
    
    // Object Read/Edit/Delete Access Testing
    public boolean getLeadAccess(){
        return Schema.sObjectType.Lead.isAccessible();
    }
    public boolean getLeadEditAccess(){
        return Schema.sObjectType.Lead.isUpdateable();
    }
    public boolean getLeadDeleteAccess(){
        return Schema.sObjectType.Lead.isDeletable();
    }
    public boolean getAccountAccess(){
        return Schema.sObjectType.Account.isAccessible();
    }
    public boolean getAccountEditAccess(){
        return Schema.sObjectType.Account.isUpdateable();
    }
    public boolean getAccountDeleteAccess(){
        return Schema.sObjectType.Account.isDeletable();
    }
    public boolean getAccountCreateAccess(){
        return Schema.sObjectType.Account.isCreateable();
    }
    public boolean getLeadCreateAccess(){
        return Schema.sObjectType.Lead.isCreateable();
    }
    
    // Account Field Access Testing
    public boolean getAccountNameAccess(){
        return Schema.sObjectType.Account.Fields.Name.isAccessible();
    }
    public boolean getAccountPhoneAccess(){
        return Schema.sObjectType.Account.Fields.Phone.isAccessible();
    }
    public boolean getAccountIndustryAccess(){
        return Schema.sObjectType.Account.Fields.Industry.isAccessible();
    }
    public boolean getAccountRatingAccess(){
        return Schema.sObjectType.Account.Fields.Rating.isAccessible();
    }
    
    // Lead Field Access Testing
    public boolean getLeadNameAccess(){
        return Schema.sObjectType.Lead.Fields.Name.isAccessible();
    }
    public boolean getLeadCompanyAccess(){
        return Schema.sObjectType.Lead.Fields.Company.isAccessible();
    }
    public boolean getLeadPhoneAccess(){
        return Schema.sObjectType.Lead.Fields.Phone.isAccessible();
    }
    public boolean getLeadEmailAccess(){
        return Schema.sObjectType.Lead.Fields.Email.isAccessible();
    }
    public boolean getLeadRatingAccess(){
        return Schema.sObjectType.Lead.Fields.Rating.isAccessible();
    }
    public boolean getLeadStatusAccess(){
        return Schema.sObjectType.Lead.Fields.Status.isAccessible();
    }
    
    // Wrapper Class Definitions
    public class cAccount
    {
        public Account acc {get;set;}
        public Boolean selected {get;set;}
        
        public cAccount(Account a)
        {
            acc = a;
            selected = false;
        }
    }
    
    public class cLead
    {
        public Lead le {get;set;}
        public Boolean selected {get;set;}
        
        public cLead(Lead l)
        {
            le = l;
            selected = false;
        }
    }
}