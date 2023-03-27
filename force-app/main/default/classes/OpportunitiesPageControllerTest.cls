@isTest
public class OpportunitiesPageControllerTest {

    @isTest
    public static void TP_SearchOpportunityList(){
        test.startTest();
        OpportunitiesPageController tester = new OpportunitiesPageController();
        tester.NameOpportunitySearchTerm = '';
        tester.AccountOpportunitySearchTerm = '';
        tester.StageOpportunitySearchTerm = '';
        tester.CloseDateOpportunitySearchTerm = '';
        
        List<OpportunitiesPageController.cOpportunity> TestOpportunities = tester.SearchedOpportunityList;
        
        System.assertEquals(300, TestOpportunities.size());
        
        OpportunitiesPageController tester2 = new OpportunitiesPageController();
        tester2.NameOpportunitySearchTerm = 'FredAndGeorge';
        tester2.AccountOpportunitySearchTerm = '';
        tester2.StageOpportunitySearchTerm = '';
        tester2.CloseDateOpportunitySearchTerm = '';
        
        List<OpportunitiesPageController.cOpportunity> TestOpportunities2 = tester2.SearchedOpportunityList;
        
        System.assertEquals(0, TestOpportunities2.size());
        
        OpportunitiesPageController tester3 = new OpportunitiesPageController();
        tester3.NameOpportunitySearchTerm = '1';
        tester3.AccountOpportunitySearchTerm = '';
        tester3.StageOpportunitySearchTerm = '';
        tester3.CloseDateOpportunitySearchTerm = '';
        
        List<OpportunitiesPageController.cOpportunity> TestOpportunities3 = tester3.SearchedOpportunityList;
        
        System.assertEquals(138, TestOpportunities3.size());
    }
    
    @isTest
    public static void TP_Links(){
        test.startTest();
        //Test Opportunities Page Link
        Test.setCurrentPage(Page.Opportunities);
        OpportunitiesPageController OPC = new OpportunitiesPageController();
        
        Test.setCurrentPageReference(OPC.OpportunitiesPage());
        
        System.assertEquals(Page.Opportunities.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Contacts Page Link
        Test.setCurrentPage(Page.Opportunities);
        Test.setCurrentPageReference(OPC.ContactsPage());
        
        System.assertEquals(Page.ContactsAndTechs.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Orders Page Link
        Test.setCurrentPage(Page.Opportunities);
        Test.setCurrentPageReference(OPC.OrdersPage());
        
        System.assertEquals(Page.OrdersWithProducts.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Accounts And Leads Page Link
        Test.setCurrentPage(Page.Opportunities);
        Test.setCurrentPageReference(OPC.AccountsAndLeadsPage());
        
        System.assertEquals(Page.AccountsAndLeads.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Work Orders Page Link
        Test.setCurrentPage(Page.Opportunities);
        Test.setCurrentPageReference(OPC.WorkOrdersPage());
        
        System.assertEquals(Page.AccountsAndLeads.getUrl(), ApexPages.currentPage().getUrl());
        test.stopTest();
    }
    
    @isTest
    public Static void TP_SaveOpportunity(){
        test.startTest();
        OpportunitiesPageController tester = new OpportunitiesPageController();
        tester.NameOpportunitySearchTerm = 'Dancing Bears Eat More Cheese';
        tester.AccountOpportunitySearchTerm = 'TestAccount';
        tester.StageOpportunitySearchTerm = 'Closed Won';
        tester.CloseDateOpportunitySearchTerm = '8/21/2025';
        Account TestAccount = [SELECT Name FROM Account];
        
        Try{
            List<Opportunity> TestNoOpportunity = [SELECT Name FROM Opportunity WHERE Name = 'Dancing Bears Eat More Cheese'];
        }
        catch(System.QueryException e){
            System.Assert(True);
        }
        
        tester.SaveOpportunity();
        Opportunity NewOpportunity = [SELECT Name, AccountId, StageName, CloseDate FROM Opportunity WHERE Name = 'Dancing Bears Eat More Cheese'];
        Opportunity TestOpportunity = new Opportunity(
            Name = 'Dancing Bears Eat More Cheese',
            AccountId = TestAccount.Id,
            StageName = 'Closed Won',
            CloseDate = Date.newInstance(2025, 08, 21));
        test.stopTest();
        System.assertEquals(TestOpportunity.Name, NewOpportunity.Name);
        System.assertEquals(TestOpportunity.AccountId, NewOpportunity.AccountId);
        System.assertEquals(TestOpportunity.StageName, NewOpportunity.StageName);
        System.assertEquals(TestOpportunity.CloseDate, NewOpportunity.CloseDate);
        
    }
    
    @isTest
    public static void TP_DeleteOpportunity(){
        test.startTest();
        OpportunitiesPageController tester = new OpportunitiesPageController();
        List<OpportunitiesPageController.cOpportunity> OppstoDelete = tester.SearchedOpportunityList;
        tester.cOppList[0].selected = true;
        
        tester.DeleteOpportunity();
        
        List<OpportunitiesPageController.cOpportunity> OppstoCompare = tester.SearchedOpportunityList;
        test.stopTest();
        System.assertEquals(OppstoDelete.size()-1, OppstoCompare.size());
    }
    
    @isTest
    public static void TP_UpdateOpportunity(){
        test.startTest();
		OpportunitiesPageController tester = new OpportunitiesPageController();
        tester.OpportunityList[0].Name = 'I like Cheese';
        
        tester.UpdateOpportunity();
        List<Opportunity> testlist = [SELECT Name FROM Opportunity];
        test.stopTest();
        System.AssertEquals('I like Cheese', testlist[0].Name);
    }
    
    @isTest
    public static void TRU_Security(){
        OpportunitiesPageController tester = new OpportunitiesPageController();
        User devonDemo = [
     		SELECT Name
      		FROM User
      		WHERE Profile.Name = 'Basic Sales Profile'
      		LIMIT 1
    		];
        System.runAs(devonDemo){
        System.assertEquals(True, tester.getOppCloseDateAccess(), 'closeDate');
        System.assertEquals(True, tester.getOppAccess(), 'OppAccess');
        System.assertEquals(True, tester.getOppEditAccess(), 'Edit');
        System.assertEquals(True, tester.getOppCreateAccess(), 'Create');
        System.assertEquals(True, tester.getOppDeleteAccess(), 'Delete');
        System.assertEquals(True, tester.getOppNameAccess(), 'OppName');
        System.assertEquals(True, tester.getOppAccountAccess(), 'OppAccount');
        System.assertEquals(True, tester.getOppStageAccess(), 'OppStage');
        }
        
    }
    
    
    
    
    
    @testSetup
    public static void TestSetup(){
        Account TestAccount = new Account(
        	Name = 'TestAccount');
        insert TestAccount;
        List<Opportunity> DummyOpportunities = new List<Opportunity>();
        for(Integer i = 0; i<300; i++){
            Opportunity opp = new Opportunity();
            opp.Name = 'Acme ' + i;
            opp.AccountId = TestAccount.Id;
            opp.StageName = 'Closed Won';
            opp.CloseDate = Date.newInstance(2023, 06, 09);
        	DummyOpportunities.add(opp);
        }
        insert DummyOpportunities;
        
        
    }
}