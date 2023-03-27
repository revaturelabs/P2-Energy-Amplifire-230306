public class OrderswithProductsController {
    
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
    
    public String orderId {get; set;}
    
    public List<SelectOption> getOrderOptions(){
        List<Order> orderList = [SELECT OrderNumber, Id FROM Order ORDER BY OrderNumber];
        List<SelectOption> options = new List<SelectOption>();
        for (Order ord : orderList){
            options.add(new SelectOption(ord.Id, ord.OrderNumber));
        }
        return options;
    }
}