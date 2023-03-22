trigger CustomerSuccessCascade on Customer_Success_Story__c (
  before insert,
  before update,
  before delete,
  after insert,
  after update,
  after delete,
  after undelete
    )
{
    
switch on Trigger.operationType {
    when BEFORE_INSERT {
      // Can only use Trigger.new
      // Trigger Best Practice #2: Keep triggers logicless
    
    }
    when BEFORE_UPDATE {
      // Can use Trigger.new or Trigger.old
    }
    when BEFORE_DELETE {
      // Can only use Trigger.old
    }
    when AFTER_INSERT {
      // Can only use Trigger.new
       Customer_Success_Cascade_Helper.RatingRank(trigger.new);
    }
    when AFTER_UPDATE {
       // Customer_Success_Cascade_Helper.RatingRank(trigger.new);
      // Can use Trigger.new or Trigger.old
    }
    when AFTER_DELETE {
      // Can only use Trigger.old
    }
    when AFTER_UNDELETE {
      // Can only use Trigger.new
    }
  }
}