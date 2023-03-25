trigger OrderItemTrigger on OrderItem (after insert, after delete) {
    switch on Trigger.operationType {
        when BEFORE_INSERT {
    	}
    	when BEFORE_UPDATE {
    	}
    	when BEFORE_DELETE {
        }
        when AFTER_INSERT {
            NewWork.CreateNewOrder(Trigger.new);
            OrderItemTriggerHelper.ApplyPaperProductFee(Trigger.new);
        }
        when AFTER_UPDATE {   
        }
        when AFTER_DELETE {
        }
        when AFTER_UNDELETE {
        }
    }
}