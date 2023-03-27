trigger ContactRelatedAccounts on Contact (before insert, before update) {
    List<Contact> contactList = new List<Contact>();
    List<Contact> accountContactList =[SELECT Email, AccountId FROM Contact WHERE AccountId != NULL];
    
    for (Contact c : trigger.new) {
        if(c.AccountId != NULL && c.Email != NULL){
            
            
            
            Integer NewConEmailIndex = c.Email.indexOf('@');
            String NewContactEmailEnding = c.Email.substring(NewConEmailIndex);
            Set<String> OldContactEmailEndings = new Set<String>(); 
            
            for (Contact ct : accountContactList) {
                if(ct.Email != NULL){
                    if(c.AccountId == ct.AccountId) {
                        Integer OldConEmailIndex = ct.Email.indexOf('@');
                        String OldContactEmailEnding = ct.Email.subString(OldConEmailIndex);
                        OldContactEmailEndings.add(OldContactEmailEnding);   
                        
                    }
                }
            }
            if(OldContactEmailEndings.size() != 0){
                if(!OldContactEmailEndings.contains(NewContactEmailEnding)){
                    contactList.add(c);
                }
            }
        }
    }
    for(Contact ct : ContactList){
        ct.addError('The email does not fit the current format');
    }
}