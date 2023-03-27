public with sharing class OpportunitiesPageController {
    
    public List<Opportunity> OpportunityList { get; set; }
    
    public String NameOpportunitySearchTerm { get; set; }
    public String AccountOpportunitySearchTerm { get; set; }
    public String StageOpportunitySearchTerm { get; set; }
    public String CloseDateOpportunitySearchTerm { get; set; }
    
    public List<cOpportunity> cOppList { get; set; }
    public List<cOpportunity> SearchedOpportunityList { get{
        List<cOpportunity> temp = new List<cOpportunity>();
        for(Opportunity opp : OpportunityList){
            String OppName = opp.Name;
            String OppAccount = '';
            String OppStage = '';
            String OppDate = '';
            if(opp.Account.Name != NULL){
                oppAccount = (String)opp.Account.Name;
            }
            if(opp.StageName != NULL){
                OppStage = (String)opp.StageName;
            }
            if(Opp.CloseDate != NULL){
                OppDate = Opp.CloseDate.format();
            }
            if(OppName.containsIgnoreCase(NameOpportunitySearchTerm)){
                if(OppAccount.containsIgnoreCase(AccountOpportunitySearchTerm)){
                    if(OppStage.containsIgnoreCase(StageOpportunitySearchTerm)){
                        if(OppDate.containsIgnoreCase(CloseDateOpportunitySearchTerm)){
                            temp.add(new cOpportunity(opp));
                        }
                    }
                }
            }
        }
        cOppList = temp;
        return temp;
    }
                                                      }
    //Constructor
    public OpportunitiesPageController(){
        OpportunityList = [SELECT Name, Account.Name, StageName, CloseDate FROM Opportunity];
        NameOpportunitySearchTerm = '';
        AccountOpportunitySearchTerm = '';
        StageOpportunitySearchTerm = '';
        CloseDateOpportunitySearchTerm = '';
        cOppList = new List<cOpportunity>();
    }
    
    //Useful Links Methods
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
    
    
    // Save, Edit, and Delete functions
    public PageReference SaveOpportunity(){
        List<Account> RelatedAcc = [SELECT Id FROM Account WHERE Name LIKE :AccountOpportunitySearchTerm LIMIT 1];
        id RelatedAccId = RelatedAcc[0].Id;
        Opportunity newOpportunity = new Opportunity(
            Name = NameOpportunitySearchTerm,
            AccountId = RelatedAccId,
            StageName = StageOpportunitySearchTerm,
        	CloseDate = Date.parse(CloseDateOpportunitySearchTerm));
        insert newOpportunity;
        PageReference nextPage = Page.Opportunities;
        OpportunityList = [SELECT Name, Account.Name, StageName, CloseDate FROM Opportunity];
        NameOpportunitySearchTerm = '';
        AccountOpportunitySearchTerm = '';
        StageOpportunitySearchTerm = '';
        CloseDateOpportunitySearchTerm = '';
        return nextPage;
    }
    
    public PageReference UpdateOpportunity(){
        update OpportunityList;
        PageReference nextPage = Page.Opportunities;
        OpportunityList = [SELECT Name, Account.Name, StageName, CloseDate FROM Opportunity];
        return nextPage;
    }
    
    public PageReference DeleteOpportunity(){
        List<Opportunity> OppsToDelete = new List<Opportunity>();
        for(cOpportunity cOpp : cOppList){
            if(cOpp.selected == true){
                OppsToDelete.add(cOpp.opp);
            }
        }
        delete OppsToDelete;
        PageReference nextPage = Page.Opportunities;
        OpportunityList = [SELECT Name, Account.Name, StageName, CloseDate FROM Opportunity];
        return nextPage;
    }
    
    // Object Read/Edit/Delete Access Testing
    public boolean getOppAccess(){
        return Schema.sObjectType.Opportunity.isAccessible();
    }
    public boolean getOppEditAccess(){
        return Schema.sObjectType.Opportunity.isUpdateable();
    }
    public boolean getOppDeleteAccess(){
        return Schema.sObjectType.Opportunity.isDeletable();
    }
    public boolean getOppCreateAccess(){
        return Schema.sObjectType.Opportunity.isCreateable();
    }
    
    // Account Field Access Testing
    public boolean getOppNameAccess(){
        return Schema.sObjectType.Opportunity.Fields.Name.isAccessible();
    }
    public boolean getOppAccountAccess(){
        boolean oppAccountAccess = Schema.sObjectType.Opportunity.Fields.AccountId.isAccessible() && Schema.sObjectType.Account.Fields.Name.isAccessible();
        return oppAccountAccess;
    }
    public boolean getOppStageAccess(){
        return Schema.sObjectType.Opportunity.Fields.StageName.isAccessible();
    }
    public boolean getOppCloseDateAccess(){
        return Schema.sObjectType.Opportunity.Fields.CloseDate.isAccessible();
    }
    
    // Wrapper Class Definitions
    public class cOpportunity{
        public Opportunity opp { get; set; }
        public Boolean selected { get; set; }
        
        public cOpportunity(Opportunity o){
            opp = o;
            selected = false;
        }
    }
}