public class CloseOpportunityTaskMaker {
    public void TaskMaker(){
        List<Opportunity> ClosingOpportunities = [SELECT Name, OwnerId, CloseDate FROM Opportunity WHERE CloseDate = NEXT_N_DAYS:31];
        List<Task> TasksToInsert = new List<Task>();
        for (Opportunity opp : ClosingOpportunities){
            Task newTask = new Task(
            	OwnerId = opp.OwnerId,
                Priority = 'Normal',
                Status = 'Not Started',
                Subject = 'Other',
                ActivityDate = opp.CloseDate,
                Description = 'Please make sure to close this deal!',
                WhatId = opp.Id
            );
            TasksToInsert.add(newTask);
        }
        insert TasksToInsert;
    }
}