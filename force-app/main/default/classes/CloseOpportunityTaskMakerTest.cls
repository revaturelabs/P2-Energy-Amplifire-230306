@isTest
public class CloseOpportunityTaskMakerTest {
    
    @isTest
    public static void TP_TaskMaker(){
        CloseOpportunityTaskMaker tester = new CloseOpportunityTaskMaker();
        Date StartDate = Date.today();
        List<user> devonDemo = [SELECT Name FROM User LIMIT 1];
        List<Account> TestAccount = [SELECT Name FROM Account LIMIT 1];
        Opportunity opp = new Opportunity();
        	opp.OwnerId = devonDemo[0].Id;
        	opp.Name = 'Dancing Bears';
            opp.AccountId = TestAccount[0].Id;
            opp.StageName = 'Perception Analysis';
            opp.CloseDate = StartDate.addDays(7);
        insert opp;
        tester.TaskMaker();
        
        Integer tasklist = [SELECT COUNT() FROM Task WHERE ActivityDate = :opp.CloseDate];
        System.assertNotEquals(0, tasklist);
            
    }
    
    @testSetup
    public static void SetupTest(){
        Account TestAccount = new Account(
            Name = 'Test Account');
        insert TestAccount;
    }
}