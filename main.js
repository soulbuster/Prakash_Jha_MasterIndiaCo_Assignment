const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const prompt = require('prompt');

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

app.get("/",function(req,res){ //Read
    employee.find({}, function(err, employees) { 
        res.end(JSON.stringify(employees));
    })
});

app.post("/create", function(req, res) { //create
    const eid = req.body.EID;
    const name = req.body.Name;
    const email = req.body.Email;
    const phno = req.body.Phno;
    console.log(eid+" "+name+" "+email+" "+phno);
    const newEmp = new employee({
      EID:eid,
      Name: name,
      Email: email,
      Phno: phno
    });
    employee.insertMany(newEmp);
    res.redirect("/");
  });

app.delete("/delete", function(req, res) {  //delete
    const eid = req.body.EID;
      employee.deleteOne({
        EID:eid
      }, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Success");
        }
      });
      res.redirect("/");
});

app.put("/update", function(req,res){  //update
    var eid = req.body.EID;
    var name = req.body.Name;
    var Email = req.body.Email;
    var Phno = req.body.Phno;
    var updates = {};
    if (typeof name !== 'undefined') updates['Name'] = name;
    if (typeof Email !== 'undefined') updates['Email'] = Email;
    if (typeof Phno !== 'undefined') updates['Phno'] = Phno;
    const options = { upsert: true };
    //console.log(updateVal);
    var status = 0;
    employee.updateOne({
        EID: eid
    },{$set:updates},function(err,res1){
        console.log(res1);
        status = res1.modifiedCount;
        if(status==0) alert(eid+" not found");
        else res.redirect("/");
    });
    
});


app.listen(1080,function(){
    console.log("server started");
})
