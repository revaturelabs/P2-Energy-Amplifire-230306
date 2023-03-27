@isTest
public class CustomerSuccessCascadeTest {
    
    @isTest
    public static void TP_RatingRank(){
    	List<Customer_Success_Story__c> TestStories = new List<Customer_Success_Story__c>();
    	for(Integer i = 0; i<5; i++){
            Customer_Success_Story__c TestStory = new Customer_Success_Story__c();
            TestStory.Name = 'Test Story #' +i;
            TestStory.Account__c = '0018b00002Mf4joAAB';
            TestStory.Products__c = '01t8b00000DFEU5AAP';
            TestStory.Rating__c = i+1;
            TestStories.add(TestStory);
        }
        
        test.startTest();
        insert TestStories;
        test.stopTest();
        List<Customer_Success_Story__c> TestValues = [SELECT Rating__c, Rank__c FROM Customer_Success_Story__c WHERE Name LIKE 'Test Story #%' ORDER BY Rating__c DESC];
        System.assertEquals(1, TestValues[0].Rank__c);
        System.assertEquals(2, TestValues[1].Rank__c);
        System.assertEquals(3, TestValues[2].Rank__c);
        System.assertEquals(4, TestValues[3].Rank__c);
        System.assertEquals(5, TestValues[4].Rank__c);
    }
    
    @isTest
    public static void TP_DeleteTrigger(){
        
        List<Customer_Success_Story__c> TestStories = new List<Customer_Success_Story__c>();
    	for(Integer i = 0; i<5; i++){
            Customer_Success_Story__c TestStory = new Customer_Success_Story__c();
            TestStory.Name = 'Test Story #' +i;
            TestStory.Account__c = '0018b00002Mf4joAAB';
            TestStory.Products__c = '01t8b00000DFEU5AAP';
            TestStory.Rating__c = i+1;
            TestStories.add(TestStory);
        }
        Insert TestStories;
        Customer_Success_Story__c TestDelete = [SELECT Name FROM Customer_Success_Story__c WHERE Name LIKE 'Test Story #%' and Rating__c = 5];
            
        Test.StartTest();
        delete TestDelete;
        Integer TestCount = [SELECT COUNT() FROM Customer_Success_Story__c WHERE Name LIKE 'Test Story #%' and Rank__c = 1];
        Integer TestCount1 = [SELECT COUNT() FROM Customer_Success_Story__c WHERE Name LIKE 'Test Story #%' and Rating__c = 5];
        undelete TestDelete;
        Test.stopTest();
            
        System.assertEquals(0, TestCount);
        System.assertEquals(0, TestCount1);
        
    }
}