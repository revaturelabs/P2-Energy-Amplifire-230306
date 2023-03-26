public class Customer_Success_Cascade_Helper {
    
    public static void RatingRank(List<Customer_Success_Story__c> CssList)
    {
        List<Customer_Success_Story__c> allStories =  [Select Name, Rating__c From Customer_Success_Story__c Order by Rating__c DESC];
        Integer Rank;
        for (Integer i = 1; i <= allStories.size();i++)
            allStories[i-1].Rank__c = i; 
        
        update(allStories);
    }

}