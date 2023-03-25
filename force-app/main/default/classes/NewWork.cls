public class NewWork {
    public static void createNewOrder(List<OrderItem> orderList) 
    {
        List<OrderItem> ProductList = [SELECT Id,Order.AccountId,Product2.Contact__c From OrderItem
                                      Where id in :orderList And Product2.Contact__c != Null];
        List<Work_Order__c> OrdersToInsert = new List<Work_Order__c>();
        for (OrderItem oi : ProductList)
        {
            Work_Order__c Order2Add = new Work_Order__c();
            Order2Add.Name = 'Assigned to the Product Owner';
            Order2Add.Contact__c = oi.Product2.Contact__c;
            Order2Add.Account__c = oi.Order.AccountId;
            OrdersToInsert.add(Order2Add);             
        }
        insert OrdersToInsert;
     }
}