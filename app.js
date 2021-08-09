//Basic Banking System

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { query } = require("express");

//express element
const app = express();
 app.set('view engine', "ejs"); 
app.use(bodyParser.urlencoded({extended:true}));

//Accessing CSs File
app.use(express.static("public"));

//Mongoose Connection
mongoose.connect("mongodb://localhost:27017/customerDB", {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: true});

//Variable 
var CusName;
var ResName;
var trasAmount;
var ts = false;

//Date 
const today = new Date();
var options ={
    weekday :"long",
    day : "numeric",
    month : "long",
    year : "numeric"
}
var day = today.toLocaleDateString("en-US", options)

//Creating customer Schema
const customerSchema = {
    name : String,
    email : String,
    balance : Number
}

//Creating table with customer Schema
const Customer = mongoose.model("customer", customerSchema);

//Creating Customer DataBase
const mem1 = new Customer({
    name : "customer1",
    email : "customer1@gmail.com",
    balance : 10000
});
const mem2 = new Customer({
    name : "customer2",
    email : "customer2@gmail.com",
    balance : 10000
});
const mem3 = new Customer({
    name : "customer3",
    email : "customer3@gmail.com",
    balance : 10000
});
const mem4 = new Customer({
    name : "customer4",
    email : "customer4@gmail.com",
    balance : 10000
});
const mem5 = new Customer({
    name : "customer5",
    email : "customer5@gmail.com",
    balance : 10000
});
const mem6= new Customer({
    name : "customer6",
    email : "customer6@gmail.com",
    balance :10000
});
const mem7 = new Customer({
    name : "customer7",
    email : "customer7@gmail.com",
    balance : 10000
});
const mem8 = new Customer({
    name : "customer8",
    email : "customer8@gmail.com",
    balance : 10000
});
const mem9 = new Customer({
    name : "customer9",
    email : "customer9@gmail.com",
    balance : 10000
});
const mem10= new Customer({
    name : "customer10",
    email : "customer10@gmail.com",
    balance : 10000
});

//Assgining all customer details to Customers variable 

const Customers = [mem1,mem2,mem3,mem4,mem5,mem6,mem7,mem8,mem9,mem10];

//localhost :3000 Get method
app.get("/", function(req,res){
    res.render("Home");
});

//localhost:3000/Customer GetMethod

app.get("/Customer", function(req,res){
    Customer.find({}, function(err, foundmem){
        if (foundmem.length === 0) {
          Customer.insertMany(Customers, function(err){
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully added to Database.");
            }
          });
        } else {
            res.render("customer",{csData : foundmem});
        }
      });   
});

// Transactions Variable 

var CusName;
var Tstatus = false;
var TErrmsg;
var SenderBalance;
var ReceiverBalance;

//localhost:3000/Transactions/SenderName Getmethod

app.get("/Transactions/:CusName", function(req, res){
    CusName = req.params.CusName;
    Customer.findOne({name : CusName}, function(err, foundSEN){
        if(!err){
            /* res.render("oneCus",{CusInfo : foundMem}); */
            console.log(Tstatus);
            res.render("transaction",{memName : CusName , Terr : Tstatus , Terrmsg : TErrmsg , CusInfo : foundSEN}); 
        }
        else{
            console.log(err);
        }
    });
});

//Transactions Post

app.post("/Transactions", function(req,res){
    ResName = req.body.resName;
     trasAmount = req.body.amount;
    Customer.findOne({name : ResName}, function(err, foundCus){
        if(!err){
            console.log("Logged")
            Tstatus = true;
            if(!foundCus){
                TErrmsg =1;
                res.redirect("/Transactions/" + CusName);
            }else{
                Customer.findOne({name : CusName}, function(err , foundSend){
                    if(foundSend.balance >= trasAmount){
                        const Trans = new AllTras({
                            SName: CusName,
                            ReName: ResName,
                            SeMoney : trasAmount,
                            Time : day
                          });
                          Tstatus = false;
                          Trans.save();
                          TransArray.push(Trans);
                          SenderBalance = foundSend.balance - trasAmount;
                          ReceiverBalance = parseInt(foundCus.balance) +parseInt(trasAmount);
                          Customer.updateOne( {name: foundSend.name}, {balance : SenderBalance }, function(err){
                              if(err){
                                  console.log(err);
                              }
                              else{
                                  console.log("successfully Updated");
                              }
                          });
                          Customer.updateOne({name : foundCus.name},{balance : ReceiverBalance},function(err){
                              if(err){
                                  console.log(err);
                              }else{
                                console.log("successfully Updated");
                              }
                          });
                         
                          res.redirect("/AllTransactions");

                    }else{
                        TErrmsg = 2;
                        res.redirect("/Transactions/" + CusName);
                    }
                });
            }
        }
        else{
            console.log(err);
        }
    });
});

//Transform Variable 

var Status = false;
var errmsg;
app.get("/Transform" , function(req,res){
    res.render("transform", { errstatus:Status, errmsg: errmsg});
    Status = false;
}); 

//Transaction DataBase

const AllTSchema = {
    SName : String,
    ReName : String,
    SeMoney : Number,
    Time : String
}
const AllTras = mongoose.model("Transaction", AllTSchema);
//All Transaction
app.get('/AllTransactions' , function(req,res){
    res.render("All", {Ts : TransArray});
});
const TransArray =[]

app.post("/AllTransactions", function(req,res){
    //Normal Transaction Data
    const SenderName =   req.body.Sname;
    const ReceiverName = req.body.Rname;
    const Money = req.body.money;

    //fINDING ENTERED DETAILS OR FOUND IN DATABASE OR NOT
    Customer.findOne({name : SenderName}, function(err , foundCus){
        if(!err){
            Status = true;
            if(!foundCus){
                errmsg = 1 ;
                res.redirect("/transform");
            }else{
                Customer.findOne({name : ReceiverName}, function(err , foundCus1){
                    if(!foundCus1){
                        errmsg = 2;
                        res.redirect("/transform");
                    }else{
                        if(foundCus.balance >= Money  ){
                            const Trans = new AllTras({
                                SName: SenderName,
                                ReName: ReceiverName,
                                SeMoney : Money,
                                Time : day
                              });
                            Trans.save();
                            TransArray.push(Trans);
                            SenderBalance = foundCus.balance- Money;
                            ReceiverBalance = parseInt(foundCus1.balance) +parseInt(Money);
                            Customer.updateOne( {name: foundCus.name}, {balance : SenderBalance }, function(err){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log("successfully Updated");
                                }
                            });
                            Customer.updateOne({name : foundCus1.name},{balance : ReceiverBalance},function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("successfully Updated");
                                }
                            });
                            Status = false;
                            res.render("All" ,{Ts : TransArray });
                        }
                        else{
                            errmsg = 3 ;
                            res.redirect("/transform");
                        }
                    }
                });
            }
        }else{
            console.log(err)
        }
    });
});

//Server listening on localhost:3000

app.listen(3000, function(req,res){
    console.log("server Started");
});
