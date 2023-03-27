public with sharing class ContactsAndTechsController {
    
    public List<Contact> Customers { get; set; }
    public List<Contact> Technicians { get; set; }
    
    public String NameTechSearchTerm { get; set; }
    public String PhoneTechSearchTerm { get; set; }
    public String EmailTechSearchTerm { get; set; }
    public String AccountTechSearchTerm { get; set; }
    
    public String NameCustSearchTerm { get; set; }
    public String PhoneCustSearchTerm { get; set; }
    public String EmailCustSearchTerm { get; set; }
    public String AccountCustSearchTerm { get; set; }
    
    public List<cContact> cTechList { get; set; }
    public List<cContact> cCustList { get; set; }
    public List<cContact> SearchedTechList { get{
        List<cContact> temp = new List<cContact>();
        for(Contact tech : Technicians){
            String TechPhone = '';
            String TechEmail = '';
            String TechAccountName = '';
            String TechName = tech.Name;
            if(tech.MobilePhone != NULL){
                techPhone = (String)tech.MobilePhone;
            }
            if(tech.Email != NULL){
                techEmail = (String)tech.Email;
            }
            if(tech.AccountId != NULL){
                techAccountName = tech.Account.Name;
            }
            if(TechName.containsIgnoreCase(NameTechSearchTerm)){
                if(TechPhone.containsIgnoreCase(PhoneTechSearchTerm)){
                    if(TechEmail.containsIgnoreCase(EmailTechSearchTerm)){
                        if(TechAccountName.ContainsIgnoreCase(AccountTechSearchTerm)){
                            temp.add(new cContact(tech));
                        }
                    }
                }
            }
        }
        cTechList = temp;
        return temp;
    }}
    
    public List<cContact> SearchedCustList { get{
        List<cContact> temp = new List<cContact>();
        for(Contact cust : Customers){
            String custPhone = '';
            String custEmail = '';
            String custAccountName = '';
            String custName = cust.Name;
            if(cust.MobilePhone != NULL){
                custPhone = (String)cust.MobilePhone;
            }
            if(cust.Email != NULL){
                custEmail = (String)cust.Email;
            }
            if(cust.AccountId != NULL){
                custAccountName = cust.Account.Name;
            }
            if(custName.containsIgnoreCase(NamecustSearchTerm)){
                if(custPhone.containsIgnoreCase(PhonecustSearchTerm)){
                    if(custEmail.containsIgnoreCase(EmailcustSearchTerm)){
                        if(custAccountName.ContainsIgnoreCase(AccountcustSearchTerm)){
                            temp.add(new cContact(cust));
                        }
                    }
                }
            }
        }
        cCustList = temp;
        return temp;
    }}
    
    
    
    public ContactsAndTechsController(){
        Customers = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Customer'];
        Technicians = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Technician'];
        
        NameTechSearchTerm = '';
        PhoneTechSearchTerm = '';
        EmailTechSearchTerm = '';
        AccountTechSearchTerm = '';
        
        NameCustSearchTerm = '';
        PhoneCustSearchTerm = '';
        EmailCustSearchTerm = '';
        AccountCustSearchTerm = '';
        
        
        cTechList = new List<cContact>();
        cCustList = new List<cContact>();
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
        PageReference nextPage = Page.OrdersWithProducts;
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
    
    public PageReference SaveTechnicians(){
        String TechFirstName = '';
        String TechLastName = '';
        List<Account> IdAccount = new List<account>();
        if(AccountTechSearchTerm != NULL){
        	String AccountSearch = '%' + AccountTechSearchTerm + '%';
        	IdAccount = [SELECT Id FROM Account WHERE Name LIKE :AccountSearch];
        }
        if(NameTechSearchTerm.contains(' ')){
            Integer index = NameTechSearchTerm.indexOf(' ');
            TechFirstName = NameTechSearchTerm.substring(0, index);
            TechLastName = NameTechSearchTerm.substring(index+1);
        }
        Else{
            TechFirstName = '';
            TechLastName = NameTechSearchTerm;
        }
        List<RecordType> RT = [SELECT Id FROM RecordType WHERE sObjectType = 'Contact' AND Name = 'Technician'];
        Contact newContact = new Contact(
            FirstName = TechFirstName,
            LastName = TechLastName,
            MobilePhone = PhoneTechSearchTerm,
            Email = EmailTechSearchTerm,
        	RecordTypeId = RT[0].Id);
        if(IdAccount.size() > 0){
        	newContact.AccountId = IdAccount[0].Id;
                }
        insert newContact;
        PageReference nextPage = Page.ContactsAndTechs;
        Technicians = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Technician'];
        NameTechSearchTerm = '';
        PhoneTechSearchTerm = '';
        EmailTechSearchTerm = '';
        AccountTechSearchTerm = '';
        return nextPage;
    }
    
    public PageReference UpdateTechnicians(){
        update Technicians;
        PageReference nextPage = Page.ContactsAndTechs;
        Technicians = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Technician'];
        return nextPage;
    }
    
    public PageReference DeleteTechnicians(){
        List<Contact> TechniciansToDelete = new List<Contact>();
        for(cContact cCon : cTechList){
            if(cCon.selected == true){
                TechniciansToDelete.add(cCon.con);
            }
        }
        delete TechniciansToDelete;
        Technicians = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Technician'];
        PageReference nextPage = Page.ContactsAndTechs;
        return nextPage;
    }
    
    public PageReference SaveCustomers(){
        String CustFirstName = '';
        String CustLastName = '';
        List<Account> IdAccount = new List<account>();
        if(AccountTechSearchTerm != NULL){
        	String AccountSearch = '%' + AccountTechSearchTerm + '%';
        	IdAccount = [SELECT Id FROM Account WHERE Name LIKE :AccountSearch];
        }
        if(NameCustSearchTerm.contains(' ')){
            Integer index = NameCustSearchTerm.indexOf(' ');
            CustFirstName = NameCustSearchTerm.substring(0, index);
            CustLastName = NameCustSearchTerm.substring(index+1);
        }
        Else{
            CustFirstName = '';
            CustLastName = NameCustSearchTerm;
        }
        List<RecordType> RT = [SELECT Id FROM RecordType WHERE sObjectType = 'Contact' AND Name = 'Technician'];
        Contact newContact = new Contact(
            FirstName = CustFirstName,
            LastName = CustLastName,
            MobilePhone = PhoneCustSearchTerm,
            Email = EmailCustSearchTerm,
        	RecordTypeId = RT[0].Id);
        if(IdAccount.size() > 0){
        	newContact.AccountId = IdAccount[0].Id;
                }
        insert newContact;
        PageReference nextPage = Page.ContactsAndTechs;
        Customers = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Customer'];
        NameCustSearchTerm = '';
        PhoneCustSearchTerm = '';
        EmailCustSearchTerm = '';
        AccountCustSearchTerm = '';
        return nextPage;
    }
    
    public PageReference UpdateCustomers(){
        update Customers;
        Customers = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Customer'];
        PageReference nextPage = Page.ContactsAndTechs;
        return nextPage;
    }
    
    public PageReference DeleteCustomers(){
        List<Contact> CustomersToDelete = new List<Contact>();
        for(cContact cCon : cCustList){
            if(cCon.selected == true){
                CustomersToDelete.add(cCon.con);
            }
        }
        delete CustomersToDelete;
        Customers = [SELECT Name, MobilePhone, Email, Account.Name FROM Contact WHERE RecordType.Name = 'Customer'];
        PageReference nextPage = Page.ContactsAndTechs;
        return nextPage;
    }
    
    // Account Field Access Testing
    public boolean getTechnicianAccess(){
        List<User> HRReps = [SELECT Name FROM User WHERE Profile.Name LIKE '%Human Resources%' OR Profile.Name LIKE '%Admin%'];
        String ContextUser = UserInfo.getUserId();
        Boolean ReturnValue = False;
        for(User u : HRReps){
            if(u.Id == ContextUser){
                ReturnValue = True;
            }
        }
        return ReturnValue;
    }
    
    // Wrapper Class Definitions
    public class cContact
    {
        public Contact con {get;set;}
        public Boolean selected {get;set;}
        
        public cContact(Contact c)
        {
            con = c;
            selected = false;
        }
    }
}