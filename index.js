var express = require('express');
var app = express();
app.use(require('connect').bodyParser());
app.use(express.static(__dirname + '/static'));
var  sf = require('node-salesforce');
const username = "yourUserEmail";
const token = "Password+SecurityToken"


//set view engine
app.set("view engine","jade")

app.get('/loan-form', function (req, res) {
    res.render('lead_form');
});

app.get('/', function(req, res){
    var records = [];
    var conn = new sf.Connection({});
    conn.login(username, token, function(err, userInfo) {
        if (err) { return console.error(err); }
        else{           
            conn.query("SELECT Name, Email, Phone, Company, Status, Description   FROM Lead ORDER BY CreatedDate desc LIMIT 20", function(err, result) {
                if (err) { return console.error(err);}
                else{ 
                    if (!result.done) {
                        console.log("next records URL : " + result.nextRecordsUrl);
                    }
                    else{                          
                        records= result.records                            
                        res.render('leads', {records: records});                   
                    }
                }           
            });
        }
    });   
})

app.get('/opportunities', function(req, res){
    var records = [];
    var conn = new sf.Connection({});
    conn.login(username, token, function(err, userInfo) {
        if (err) { return console.error(err); }
        else{           
            conn.query("SELECT Name, CloseDate, StageName FROM Opportunity ORDER BY CreatedDate desc LIMIT 20", function(err, result) {
                if (err) { return console.error(err);}
                else{ 
                    if (!result.done) {
                        console.log("next records URL : " + result.nextRecordsUrl);
                    }
                    else{                          
                        records= result.records                            
                        res.render('opportunities', {records: records});                   
                    }
                }           
            });
        }
    });   
})

app.get('/Loan', function(req, res){
    var records = [];
    var conn = new sf.Connection({});
    conn.login(username, token, function(err, userInfo) {
        if (err) { return console.error(err); }
        else{           
            conn.query("SELECT Name, Address__c, Interest_Rate__c, Loan_Amount__c, Loan_Period__c, Loan_Type__c, Phone__c   FROM Loan__c ORDER BY CreatedDate desc LIMIT 20", function(err, result) {
                if (err) { return console.error(err);}
                else{ 
                    if (!result.done) {
                        console.log("next records URL : " + result.nextRecordsUrl);
                    }
                    else{                          
                        records= result.records                                   
                        res.render('Loan-detail', {records: records});                   
                    }
                }           
            });
        }
    });   
})
/// Create Lead on Form Submit
app.post('/loansubmition', function(req, res) {

    var  conn = new sf.Connection({ });
    conn.login(username, token, function(err, userInfo) {
    if (err) { return console.error(err); }
    else {
        console.log(conn);
        conn.sobject("Lead").create({
            LastName: req.body.last_name,
            FirstName: req.body.first_name,
            Email: req.body.email,
            Phone: req.body.phone ,
            //Address: req.body.address,
            Company: "Test",
            Status: "Open - Not Contacted",
            Description : "Loan Amount : "+ req.body.laoan_amount + ", Interest Rate:"+  req.body.interest_rate + "EMI: "+ req.body.emi_per_month ,
        }, function(err, ret) {
                if (err || !ret.success) { return console.error(err, ret); } 
            }
        )
    }
    });

    // Create Custom Loan Object

    conn.login(username, token, function(err, userInfo) {
    if (err) { return console.error(err); }
    else {
        conn.sobject("Loan__c").create({
            Name: req.body.first_name + " " + req.body.last_name,
            Address__c: req.body.address,
            Interest_Rate__c: req.body.interest_rate,
            Loan_Amount__c: req.body.laoan_amount,
            Loan_Period__c: req.body.total_loan_period,
            Loan_Type__c: "Home",
            Phone__c: req.body.phone,

        }, function(err, ret) {
            if (err || !ret.success) { return console.error(err, ret); }  
        });
    }
    });

    // Create Opportunity

    conn.login(username, token, function(err, userInfo) {
        if (err) { return console.error(err); }
        else {
            conn.sobject("Opportunity").create({
                Name: req.body.first_name + " " + req.body.last_name,
                CloseDate: '2018-08-01',
                StageName: "Prospecting",
            }, function(err, ret) {            
                if (err || !ret.success) { return console.error(err, ret); } 
                           
            });
        }
        });
    
    res.redirect('/');
});

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});
