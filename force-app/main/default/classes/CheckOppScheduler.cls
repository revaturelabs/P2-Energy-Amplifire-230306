/*
    Description: Abstract class so that it doesn't get implemented.
    Make calls to the static methods here to start, monitor or start
    the scheduled job to run the task maker.
*/
public without sharing class CheckOppScheduler implements System.Schedulable {

    public static final String CRON = '0 0 3 ? * 7#1';
    public static final String NAME = 'Opportunity Task Maker';
    
    /*
        Call to start the scheduled job
    */
    public static Id scheduleSelf() {
        try {
            CronTrigger job = [SELECT Id FROM CronTrigger WHERE CronJobDetail.Name = :NAME AND CronExpression = :CRON LIMIT 1];
            return job.Id;
        }
        catch(System.QueryException e) {}

        return System.Schedule('Opportunity Task Maker', CRON, new CheckOppScheduler());
    }

    /*
        Call to cancel the job if set. Returns true if it cancelled, false if there was nothing to cancel
    */
    public static Boolean cancelSelf() {
        List<CronTrigger> jobs = [SELECT Id FROM CronTrigger WHERE CronJobDetail.Name = :NAME AND CronExpression = :CRON];
        if (jobs.isEmpty()) {
            return false;
        }

        for (CronTrigger job : jobs) {
            System.abortJob(job.Id);
        }
        return true;
    }

    public void execute(System.SchedulableContext context) {
        CloseOpportunityTaskMaker maker = new CloseOpportunityTaskMaker();
        maker.TaskMaker();
    }
}