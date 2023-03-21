@isTest
public class CheckOppSchedulerTest {
    
    @isTest
    public static void TP_scheduleSelf() {
        List<CronTrigger> allCrons = [SELECT Id, CronJobDetail.Name FROM CronTrigger];

        Test.startTest();
        Id result = CheckOppScheduler.scheduleSelf();

        List<CronTrigger> cronsAfter = [SELECT Id, CronJobDetail.Name FROM CronTrigger];
        CronTrigger myCron = [SELECT CronJobDetail.Name, TimesTriggered, CronExpression FROM CronTrigger WHERE Id = :result];

        Test.stopTest();
        
        Assert.areEqual(allCrons.size() + 1, cronsAfter.size());
        Assert.areEqual(CheckOppScheduler.NAME, myCron.CronJobDetail.Name);
        Assert.areEqual(0, myCron.TimesTriggered);
        Assert.areEqual(CheckOppScheduler.CRON, myCron.CronExpression);
    }

    @isTest
    public static void TN_scheduleSelf() {
        List<CronTrigger> allCrons = [SELECT Id, CronJobDetail.Name FROM CronTrigger];

        
        Test.startTest();
        Id result1 = System.schedule(
            CheckOppScheduler.NAME, 
            CheckOppScheduler.CRON, 
            new CheckOppScheduler()
        );

        Id result2 = CheckOppScheduler.scheduleSelf();

        List<CronTrigger> cronsAfter = [SELECT Id, CronJobDetail.Name FROM CronTrigger];
        CronTrigger myCron = [SELECT CronJobDetail.Name, TimesTriggered, CronExpression FROM CronTrigger WHERE Id = :result2];
        Test.stopTest();

        Assert.areEqual(result1, result2);
        Assert.areEqual(allCrons.size() + 1, cronsAfter.size());
        Assert.areEqual(CheckOppScheduler.NAME, myCron.CronJobDetail.Name);
        Assert.areEqual(0, myCron.TimesTriggered);
        Assert.areEqual(CheckOppScheduler.CRON, myCron.CronExpression);
    }

    @isTest
    public static void TP_cancelSelf() {
        List<CronTrigger> cronsBefore = [SELECT Id FROM CronTrigger];

        Test.startTest();
        Id result1 = System.schedule(
            CheckOppScheduler.NAME, 
            CheckOppScheduler.CRON, 
            new CheckOppScheduler()
        );

        Boolean result = CheckOppScheduler.cancelSelf();

        Test.stopTest();

        List<CronTrigger> cronsAfter = [SELECT Id, CronJobDetail.Name FROM CronTrigger];

        Assert.isTrue(result);
        Assert.areEqual(cronsBefore.size(), cronsAfter.size());
    }

    @isTest
    public static void TN_cancelSelf() {
        Test.startTest();
        Boolean result = CheckOppScheduler.cancelSelf();
        Test.stopTest();

        Assert.isFalse(result);
    }
}