public class AccountsAndLeadsController {
    
    public List<Account> AccountList { get; set; }
    public List<Lead> LeadList { get; set; }
    public List<Account> SearchTermAccounts { get; set; }
    
    public String NameAccountSearchTerm { get; set; }
    public String PhoneAccountSearchTerm { get; set; }
    public String IndustryAccountSearchTerm { get; set; }
    public String RatingAccountSearchTerm { get; set; }
    
    public List<Account> SearchedAccountList { get{
        List<Account> temp = new List<Account>();
        if(SearchTermAccounts[0].Name == NULL){
            SearchTermAccounts[0].Name = '';
        }
        if(SearchTermAccounts[0].Phone == NULL){
            SearchTermAccounts[0].Phone = '';
        }
        if(SearchTermAccounts[0].Industry == NULL){
            SearchTermAccounts[0].Industry = '';
        }
        if(SearchTermAccounts[0].Rating == NULL){
            SearchTermAccounts[0].Rating = '';
        }
        for(Account acc : AccountList){
            String AcctPhone = '';
            String AcctIndustry = '';
            String AcctRating = '';
            String AcctName = acc.Name;
            if(acc.Phone != NULL){
                AcctPhone = (String)acc.Phone;
            }
            if(acc.Industry != NULL){
                AcctIndustry = (String)acc.Industry;
            }
            if(acc.Rating != NULL){
                AcctRating = (String)acc.Rating;
            }
            if(AcctName.contains(SearchTermAccounts[0].Name)){
                if(AcctPhone.contains(SearchTermAccounts[0].Phone)){
                    if(AcctIndustry.contains(SearchTermAccounts[0].Industry)){
                        if(AcctRating.Contains(SearchTermAccounts[0].Rating)){
                            temp.add(acc);
                        }
                    }
                }
            }
        }
        return temp;
    }}
    
    public String LeadSearchTerm { get; set; }
    public List<Lead> SearchedLeadList { get{
        List<Lead> temp = new List<Lead>();
        for(Lead le : LeadList){
            String LeadName = le.Name;
            if(LeadName.contains(LeadSearchTerm)){
                temp.add(le);
            }
        }
        return temp;
    }}
    
    public AccountsAndLeadsController(){
        LeadList = [SELECT Name, Company, Email, Phone FROM Lead];
        AccountList = [SELECT Name, Phone, Industry, Rating FROM Account];
        Account DummyAcct = new Account(
            Name = '',
            Phone = '',
            Industry = '',
            Rating = '');
        SearchTermAccounts = new List<Account>();
        SearchTermAccounts.add(DummyAcct);
        LeadSearchTerm = '';
        NameAccountSearchTerm = '';
        PhoneAccountSearchTerm = '';
        IndustryAccountSearchTerm = '';
        RatingAccountSearchTerm = '';
    }
}