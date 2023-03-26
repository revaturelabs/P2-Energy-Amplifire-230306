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
        
        System.assertEquals(Page.OrderswithProducts.getUrl(), ApexPages.currentPage().getUrl());
        
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
}