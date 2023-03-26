@isTest
public class AccountsAndLeadsControllerTest {

    @isTest
    public static void TP_SearchAccountList(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        tester.NameAccountSearchTerm = 'Acme';
        tester.PhoneAccountSearchTerm = '';
        tester.EmptyAccount.Rating = '';
        tester.EmptyAccount.Industry = '';
        
        List<AccountsAndLeadsController.cAccount> TestAccounts = tester.SearchedAccountList;
        
        System.assertEquals(300, TestAccounts.size());
        
        AccountsAndLeadsController tester2 = new AccountsAndLeadsController();
        tester2.NameAccountSearchTerm = 'Alphabet';
        tester2.PhoneAccountSearchTerm = '';
        tester2.EmptyAccount.Rating = NULL;
        tester2.EmptyAccount.Industry = NULL;
        
        List<AccountsAndLeadsController.cAccount> Test2Accounts = tester2.SearchedAccountList;
        
        System.assertEquals(0, Test2Accounts.size());
        
        AccountsAndLeadsController tester3 = new AccountsAndLeadsController();
        tester3.NameAccountSearchTerm = '';
        tester3.PhoneAccountSearchTerm = '509782142';
        tester3.EmptyAccount.Rating = NULL;
        tester3.EmptyAccount.Industry = NULL;
        
        List<AccountsAndLeadsController.cAccount> Test3Accounts = tester3.SearchedAccountList;
        
        test.stopTest();
        System.assertEquals(20, Test3Accounts.size());
    }
    
    @isTest
    public static void TP_SearchLeadList(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        tester.NameLeadSearchTerm = '';
        tester.CompanyLeadSearchTerm = '';
        tester.PhoneLeadSearchTerm = '';
        tester.EmailLeadSearchTerm = '';
        tester.RatingLeadSearchTerm = 'Hot';
        tester.StatusLeadSearchTerm = '';
        
        List<AccountsAndLeadsController.cLead> TestLeads = tester.SearchedLeadList;
        
        test.stopTest();
        System.Debug(TestLeads.size());
        System.assertEquals(300, TestLeads.size());
    }
    
    @isTest
    public static void TP_Links(){
        test.startTest();
        //Test Opportunities Page Link
        Test.setCurrentPage(Page.AccountsAndLeads);
        AccountsAndLeadsController AALC = new AccountsAndLeadsController();
        
        Test.setCurrentPageReference(AALC.OpportunitiesPage());
        
        System.assertEquals(Page.Opportunities.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Contacts Page Link
        Test.setCurrentPage(Page.AccountsAndLeads);
        Test.setCurrentPageReference(AALC.ContactsPage());
        
        System.assertEquals(Page.ContactsandTechs.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Orders Page Link
        Test.setCurrentPage(Page.AccountsAndLeads);
        Test.setCurrentPageReference(AALC.OrdersPage());
        
        System.assertEquals(Page.OrderswithProducts.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Accounts And Leads Page Link
        Test.setCurrentPage(Page.AccountsAndLeads);
        Test.setCurrentPageReference(AALC.AccountsAndLeadsPage());
        
        System.assertEquals(Page.AccountsAndLeads.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Work Orders Page Link
        Test.setCurrentPage(Page.AccountsAndLeads);
        Test.setCurrentPageReference(AALC.WorkOrdersPage());
        
        System.assertEquals(Page.AccountsAndLeads.getUrl(), ApexPages.currentPage().getUrl());
        test.stopTest();
    }
    
    @isTest
    public Static void TP_SaveAccount(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        tester.NameAccountSearchTerm = 'Sean\'s Company';
        tester.PhoneAccountSearchTerm = '5097546364';
        tester.EmptyAccount.Rating = 'Hot';
        tester.EmptyAccount.Industry = 'Electronics';
        
        Try{
            List<Account> TestNoAccount = [SELECT Name FROM Account WHERE Phone = '5097546364'];
        }
        catch(System.QueryException e){
            System.Assert(True);
        }
        
        tester.SaveAccount();
        Account NewAccount = [SELECT Name, Phone, Rating, Industry FROM Account WHERE Phone = '5097546364'];
        Account TestAccount = new Account(
            Name = 'Sean\'s Company',
            Phone = '5097546364',
            Rating = 'Hot',
            Industry = 'Electronics');
        test.stopTest();
        System.assertEquals(TestAccount.Name, NewAccount.Name);
        System.assertEquals(TestAccount.Phone, NewAccount.Phone);
        System.assertEquals(TestAccount.Rating, NewAccount.Rating);
        System.assertEquals(TestAccount.Industry, NewAccount.Industry);
        
    }
    
    @isTest
    public static void TP_DeleteAccount(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        List<AccountsAndLeadsController.cAccount> AccountstoDelete = tester.SearchedAccountList;
        tester.cAccountList[0].selected = true;
        
        tester.DeleteAccount();
        
        List<AccountsAndLeadsController.cAccount> AccountstoCompare = tester.SearchedAccountList;
        test.stopTest();
        System.assertEquals(AccountstoDelete.size()-1, AccountstoCompare.size());
    }
    
    @isTest
    public static void TP_UpdateAccount(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        tester.AccountList[0].Name = 'I like Cheese';
        
        tester.UpdateAccount();
        List<Account> testlist = [SELECT Name, Phone, Industry, Rating FROM Account];
        test.stopTest();
        System.AssertEquals('I like Cheese', testlist[0].Name);
    }
    
    @isTest
    public static void TP_SaveLead(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        tester.NameLeadSearchTerm = 'Sean Nuttall';
        tester.CompanyLeadSearchTerm = 'Seans Company';
        tester.PhoneLeadSearchTerm = '5097825491';
        tester.EmailLeadSearchTerm = 'sean.nuttall@seanscompany.com';
        tester.RatingLeadSearchTerm = 'Hot';
        tester.StatusLeadSearchTerm = 'Working - Contacted';
        
        Try{
            List<Lead> TestNoLead = [SELECT Name FROM Lead WHERE Phone = '5097825491'];
        }
        catch(System.QueryException e){
            System.Assert(True);
        }
        
        tester.SaveLead();
        Lead NewLead = [SELECT FirstName, LastName, Company, Phone, Email, Rating, Status FROM Lead WHERE Phone = '5097825491'];
        Lead TestLead = new Lead(
            FirstName = 'Sean',
            LastName = 'Nuttall',
            Company = 'Seans Company',
            Phone = '5097825491',
            Email = 'sean.nuttall@seanscompany.com',
            Rating = 'Hot',
            Status = 'Working - Contacted');
        
        AccountsAndLeadsController tester2 = new AccountsAndLeadsController();
        tester2.NameLeadSearchTerm = 'Nuttall';
        tester2.CompanyLeadSearchTerm = 'Seans Company';
        tester2.PhoneLeadSearchTerm = '5097825492';
        tester2.EmailLeadSearchTerm = 'sean.nuttall@seanscompany.com';
        tester2.RatingLeadSearchTerm = 'Hot';
        tester2.StatusLeadSearchTerm = 'Working - Contacted';
        
        Try{
            List<Lead> TestNoLead2 = [SELECT Name FROM Lead WHERE Phone = '5097825492'];
        }
        catch(System.QueryException e){
            System.Assert(True);
        }
        
        tester2.SaveLead();
        Lead NewLead2 = [SELECT FirstName, LastName, Company, Phone, Email, Rating, Status FROM Lead WHERE Phone = '5097825492'];
        Lead TestLead2 = new Lead(
            LastName = 'Nuttall',
            Company = 'Seans Company',
            Phone = '5097825492',
            Email = 'sean.nuttall@seanscompany.com',
            Rating = 'Hot',
            Status = 'Working - Contacted');
        test.stopTest();
        System.assertEquals(TestLead2.LastName, NewLead2.LastName);
        System.assertEquals(TestLead2.Company, NewLead2.Company);
        System.assertEquals(TestLead2.Phone, NewLead2.Phone);
        System.assertEquals(TestLead2.Email, NewLead2.Email);
        System.assertEquals(TestLead2.Rating, NewLead2.Rating);
        System.assertEquals(TestLead2.Status, NewLead2.Status);
        
    }
    
    @isTest
    public static void TP_DeleteLead(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        List<AccountsAndLeadsController.cLead> LeadstoDelete = tester.SearchedLeadList;
        tester.cLeadList[5].selected = true;
        
        tester.DeleteLead();
        
        List<AccountsAndLeadsController.cLead> LeadstoCompare = tester.SearchedLeadList;
        test.stopTest();
        System.assertEquals(LeadstoDelete.size()-1, LeadstoCompare.size());
    }
    
    @isTest
    public static void TP_UpdateLead(){
        test.startTest();
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        tester.LeadList[0].Company = 'My Song and Dance';
        tester.LeadList[0].Rating = 'Cold';
        
        tester.UpdateLead();
        List<Lead> testlist = [SELECT Company, Rating FROM Lead];
        test.stopTest();
        System.AssertEquals('My Song and Dance', testlist[0].Company);
        System.AssertEquals('Cold', testlist[0].Rating);
    }
    
    @isTest
    public static void TRU_Security(){
        AccountsAndLeadsController tester = new AccountsAndLeadsController();
        User devonDemo = [
     		SELECT Name
      		FROM User
      		WHERE Profile.Name = 'Basic Sales Profile'
      		LIMIT 1
    		];
        System.runAs(devonDemo){
        System.assertEquals(True, tester.getLeadAccess());
        System.assertEquals(True, tester.getLeadEditAccess());
        System.assertEquals(True, tester.getLeadCreateAccess());
        System.assertEquals(True, tester.getLeadDeleteAccess());
        System.assertEquals(True, tester.getAccountAccess());
        System.assertEquals(True, tester.getAccountEditAccess());
        System.assertEquals(True, tester.getAccountCreateAccess());
        System.assertEquals(True, tester.getAccountDeleteAccess());
        System.assertEquals(True, tester.getAccountNameAccess());
        System.assertEquals(True, tester.getAccountPhoneAccess());
        System.assertEquals(True, tester.getAccountIndustryAccess());
        System.assertEquals(True, tester.getAccountRatingAccess());
        System.assertEquals(True, tester.getLeadNameAccess());
        System.assertEquals(True, tester.getLeadCompanyAccess());
        System.assertEquals(True, tester.getLeadPhoneAccess());
        System.assertEquals(True, tester.getLeadEmailAccess());
        System.assertEquals(True, tester.getLeadRatingAccess());
        System.assertEquals(True, tester.getLeadStatusAccess());
        }
        
    }
    
    
    
    
    
    @testSetup
    public static void TestSetup(){
        List<Account> DummyAccounts = new List<Account>();
        List<Lead> DummyLeads = new List<Lead>();
        for(Integer i = 0; i<300; i++){
            Account acc = new Account();
            acc.Name = 'Acme' + i;
            if(i<10){
                acc.Phone = '509782142' + i;
            }
            else if(i<100){
                acc.Phone = '50978214' + i;
            }
            else{
                acc.Phone = '5097821' +i;
            }
            acc.Industry = 'Electronics';
            acc.Rating = 'Hot';
        	DummyAccounts.add(acc);
            
            Lead le = new Lead();
            le.FirstName = 'Lead';
            le.LastName =  ''+i;
            le.Company = 'Acme' + i;
            le.Phone = '5097821412';
            le.Email = le.FirstName + i + '@' + le.Company + '.com';
            le.Rating = 'Hot';
            le.Status = 'Open - Not Contacted';
            DummyLeads.Add(le);
        }
        insert dummyLeads;
        insert dummyAccounts;
    }
}