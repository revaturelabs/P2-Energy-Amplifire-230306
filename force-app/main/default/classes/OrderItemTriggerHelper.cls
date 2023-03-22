public class OrderItemTriggerHelper {
    
    public static void ApplyPaperProductFee(List<OrderItem> newOrderItems){
        List<OrderItem> isPaperProductOrder = [SELECT OrderId FROM OrderItem
                                          	   WHERE Product2.Paper_Product__c = true AND Id 
                                          	   IN :newOrderItems];
        List<Id> paperProductOrderIds = new List<Id>();
        for (orderItem oi : isPaperProductOrder){
        	paperProductOrderIds.add(oi.OrderId);
        }
        List<Product2> paperFeeList = [SELECT Id FROM Product2 WHERE Name = 'Paper Product Environmental Fee' LIMIT 1];
        Id paperFee = paperFeeList.get(0).Id;
        List<OrderItem> paperProductOrderAlready = [SELECT OrderId FROM OrderItem 
                                                    WHERE OrderId IN :paperProductOrderIds AND
                                                    Product2.Id = :paperFee];
        List<Id> alreadyPaperProductOrderIds = new List<Id>();
        for (orderItem oi : paperProductOrderAlready){
        	alreadyPaperProductOrderIds.add(oi.OrderId);    
        }
        List<Id> toBePaperProductOrders = new List<Id>();
        for (Id ord : paperProductOrderIds){
            Boolean toBePaperProductOrder = true;
            for (Id ord2 : alreadyPaperProductOrderIds){
                if (ord == ord2){
                    toBePaperProductOrder = false;
                    break;
                }
            }
            if (toBePaperProductOrder && !(toBePaperProductOrders.contains(ord))){
                toBePaperProductOrders.add(ord);
            }
        }
        List<Order> toBeOrderPriceBooksList = [SELECT Id, Pricebook2Id FROM Order WHERE Id IN :toBePaperProductOrders];
        List<Id> toBeOrderPriceBooks = new List<Id>();
        for (Id orderId : toBePaperProductOrders){
            for (Order ord : toBeOrderPriceBooksList){
                if (orderId == ord.Id){
                    toBeOrderPriceBooks.add(ord.Pricebook2Id);
                    break;
                }
            }
        }
        List<PricebookEntry> toBePricebookEntryList = [SELECT Pricebook2Id, UnitPrice FROM PricebookEntry WHERE Pricebook2Id IN :toBeOrderPriceBooks];
        List<Double> toBeUnitPrices = new List<Double>();
        List<Id> toBePricebookEntryIds = new List<Id>();
        for (Id pricebookId : toBeOrderPriceBooks){
            for(PricebookEntry pbe : toBePricebookEntryList){
                if (pricebookId == pbe.Pricebook2Id){
                    toBeUnitPrices.add(pbe.UnitPrice);
                    toBePricebookEntryIds.add(pbe.Id);
                    break;
                }
            }
        }
        
        List<OrderItem> toInsert = new List<OrderItem>();
        for (Integer index = 0; index < toBePaperProductOrders.size(); index++){
            OrderItem oi = new OrderItem(OrderId = toBePaperProductOrders[index],
                                         Product2Id = paperFee,
                                         UnitPrice = toBeUnitPrices[index],
                                         Quantity = 1,
                                         PricebookEntryId = toBePricebookEntryIds[index]);
        	toInsert.add(oi);   
            }
        insert toInsert;
    }
    
}