@isTest
public class OrderItemTriggerHelperTest {
	@isTest(SeeAllData=true)
    public static void testOrderWithPaperProduct(){
        Account acc = [SELECT Id FROM Account WHERE Name = 'Sample Account for Entitlements'];
        Product2 prod = [SELECT Id FROM Product2 WHERE Name = 'Office Supplies'];
        Product2 paperFee = [SELECT Id FROM Product2 WHERE Name = 'Paper Product Environmental Fee'];
        Pricebook2 pb = [SELECT Id FROM Pricebook2 WHERE Name = 'Standard'];
        PricebookEntry pbe = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :pb.Id AND Product2Id = :prod.Id];
        Test.startTest();
        Order ord = new Order(accountId = acc.Id, effectiveDate = date.today(), status = 'Draft', Pricebook2Id = pb.Id);
        insert ord;
        OrderItem oi = new OrderItem(OrderId = ord.Id, Product2Id = prod.Id, PricebookEntryId = pbe.Id, UnitPrice = pbe.UnitPrice, Quantity = 1);
        insert oi;
        Test.stopTest();
        List<OrderItem> results = [SELECT Product2Id FROM OrderItem WHERE OrderId = :ord.id];
        System.assertEquals(2, results.size(), 'Unexpected number of products in order.');
		Boolean paperProductFee = false;
        for (OrderItem oi2 : results){
            if (oi2.Product2Id == paperFee.Id){
                paperProductFee = true;
            }
        }
        System.assertEquals(true, paperProductFee, 'Automatically inserted fee not the environmental product fee.');
    }
    
    @isTest(SeeAllData=true)
    public static void testOrderWithoutPaperProduct(){
        Account acc = [SELECT Id FROM Account WHERE Name = 'Sample Account for Entitlements'];
        Product2 prod = [SELECT Id FROM Product2 WHERE Name = 'GenWatt Gasoline 300kW'];
        Product2 paperFee = [SELECT Id FROM Product2 WHERE Name = 'Paper Product Environmental Fee'];
        Pricebook2 pb = [SELECT Id FROM Pricebook2 WHERE Name = 'Standard'];
        PricebookEntry pbe = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :pb.Id AND Product2Id = :prod.Id];
        Test.startTest();
        Order ord = new Order(accountId = acc.Id, effectiveDate = date.today(), status = 'Draft', Pricebook2Id = pb.Id);
        insert ord;
        OrderItem oi = new OrderItem(OrderId = ord.Id, Product2Id = prod.Id, PricebookEntryId = pbe.Id, UnitPrice = pbe.UnitPrice, Quantity = 1);
        insert oi;
        Test.stopTest();
        List<OrderItem> results = [SELECT Product2Id FROM OrderItem WHERE OrderId = :ord.id];
        System.assertEquals(1, results.size(), 'Unexpected number of products in order.');
		Boolean paperProductFee = false;
        for (OrderItem oi2 : results){
            if (oi2.Product2Id == paperFee.Id){
                paperProductFee = true;
            }
        }
        System.assertEquals(false, paperProductFee, 'Environmental fee unexpectedly found.');
    }
    
    @isTest(SeeAllData=true)
    public static void testOrderWithPaperProducts(){
        Account acc = [SELECT Id FROM Account WHERE Name = 'Sample Account for Entitlements'];
        Product2 prod = [SELECT Id FROM Product2 WHERE Name = 'Office Supplies'];
        Product2 prod2 = [SELECT Id FROM Product2 WHERE Name = 'Technical Literature'];
        Product2 paperFee = [SELECT Id FROM Product2 WHERE Name = 'Paper Product Environmental Fee'];
        Pricebook2 pb = [SELECT Id FROM Pricebook2 WHERE Name = 'Standard'];
        PricebookEntry pbe = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :pb.Id AND Product2Id = :prod.Id];
        PricebookEntry pbe2 = [SELECT Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id = :pb.Id AND Product2Id = :prod2.Id];
        Test.startTest();
        Order ord = new Order(accountId = acc.Id, effectiveDate = date.today(), status = 'Draft', Pricebook2Id = pb.Id);
        insert ord;
        OrderItem oi = new OrderItem(OrderId = ord.Id, Product2Id = prod.Id, PricebookEntryId = pbe.Id, UnitPrice = pbe.UnitPrice, Quantity = 1);
        insert oi;
        oi = new OrderItem(OrderId = ord.Id, Product2Id = prod2.Id, PricebookEntryId = pbe2.Id, UnitPrice = pbe2.UnitPrice, Quantity = 1);
        insert oi;
        Test.stopTest();
        List<OrderItem> results = [SELECT Product2Id FROM OrderItem WHERE OrderId = :ord.id];
        System.assertEquals(3, results.size(), 'Unexpected number of products in order.');
		Boolean paperProductFee = false;
        for (OrderItem oi2 : results){
            if (oi2.Product2Id == paperFee.Id){
                paperProductFee = true;
            }
        }
        System.assertEquals(true, paperProductFee, 'Automatically inserted fee not the environmental product fee.');
    }
}