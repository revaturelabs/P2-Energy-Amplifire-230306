@isTest
public class OrderswithProductsControllerTest {
	
    @isTest
    public static void testGetOrderOptions(){
        OrderswithProductsController controller = new OrderswithProductsController();
        List<SelectOption> options = null;
        try {
            options = controller.getOrderOptions();
        }
        catch (System.Exception e) {
            System.assert(false, e.getMessage());
        }
        System.assertNotEquals(null, options, 'The method returned a null list.');
        System.assertNotEquals(0, options.size(), 'The method did not return any orders.');
    }
    
    @isTest
    public static void TP_Links(){
        test.startTest();
        //Test Opportunities Page Link
        Test.setCurrentPage(Page.OrderswithProducts);
        OrderswithProductsController OPC = new OrderswithProductsController();
        
        Test.setCurrentPageReference(OPC.OpportunitiesPage());
        
        System.assertEquals(Page.Opportunities.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Contacts Page Link
        Test.setCurrentPage(Page.OrderswithProducts);
        Test.setCurrentPageReference(OPC.ContactsPage());
        
        System.assertEquals(Page.ContactsAndTechs.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Orders Page Link
        Test.setCurrentPage(Page.OrderswithProducts);
        Test.setCurrentPageReference(OPC.OrdersPage());
        
        System.assertEquals(Page.OrderswithProducts.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Accounts And Leads Page Link
        Test.setCurrentPage(Page.OrderswithProducts);
        Test.setCurrentPageReference(OPC.AccountsAndLeadsPage());
        
        System.assertEquals(Page.AccountsAndLeads.getUrl(), ApexPages.currentPage().getUrl());
        
        //Test Work Orders Page Link
        Test.setCurrentPage(Page.OrderswithProducts);
        Test.setCurrentPageReference(OPC.WorkOrdersPage());
        
        System.assertEquals(Page.OrderswithProducts.getUrl(), ApexPages.currentPage().getUrl());
        test.stopTest();
    }
    
    @TestSetup
    public static void SetupTest(){
        List<Order> OrderList = new List<Order>();
        Account NewAccount = new Account(
        	Name = 'Test Account');
        insert NewAccount;
        Date StartDate = Date.today();
        List<Account> TestAccount = [SELECT Name FROM Account WHERE Name = 'Test Account'];
        
        for(Integer i = 0; i<200; i++){
            Order OrderAdd = new Order(
            	AccountId = TestAccount[0].Id,
            	Status = 'Draft',
            	EffectiveDate = StartDate);
          	OrderList.add(OrderAdd);
        }
        
        insert OrderList;
    }
}