const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://admin-prakash:OuuE3YJe3LAkcUdn@cluster01.bgwlu.mongodb.net/crudDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const empSchema = new mongoose.Schema({
    EID: String,
    Name: String,
    Email: String,
    Phno: Number,
},
{
    versionKey: false 
});

const employee= mongoose.model("employee",empSchema);

app.post("/create", function(req, res) { //create
    const eid = req.body.EID;
    const name = req.body.Name;
    const email = req.body.Email;
    const phno = req.body.Phno;
    const newEmp = new employee({
      EID:eid,
      Name: name,
      Email: email,
      Phno: phno
    });
    employee.find({EID:eid},function(err,result){
        if(Object.keys(result).length==0){
            employee.insertMany(newEmp,function(err,res1){
                res.redirect("/");
            });
        }else{
            res.end(eid+" already exist, try another EID");
        };
    });
  });

  app.get("/",function(req,res){ //Read
    employee.find({}, function(err, employees) { 
        res.end(JSON.stringify(employees));
    })
});

app.put("/update", function(req,res){  //update
    var eid = req.body.EID;
    var name = req.body.Name;
    var Email = req.body.Email;
    var Phno = req.body.Phno;
    var updates = {};
    if (name.length!=0) updates['Name'] = name;
    if (Email.length!=0) updates['Email'] = Email;
    if (Phno.length!=0) updates['Phno'] = Phno;
    employee.updateOne({
        EID: eid
    },{$set:updates},function(err,res1){
        if(res1.modifiedCount==0){ 
            res.end(JSON.stringify(eid+" not found"))
        }
        else res.redirect("/");
    });
    
});

app.delete("/delete", function(req, res) {  //delete
    const eid = req.body.EID;
      employee.deleteOne({
        EID:eid
      }, function(err,result) {
        if(result.deletedCount==0){
            res.end(eid+" does not exist.");
        }else{
            res.redirect("/");
        }
      });
});

app.listen(1080,function(){
    console.log("server started");
})
