const appConst = require('./appConst.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const expenseModel = require('./mongoose_model');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// base url
app.use('/', express.static("./pages/home"));

app.use("/aboutus", express.static('./pages/aboutus'));

app.get("/expenses", function(req, res) {
    mongoose.connect(appConst.mongoDbUrl + "/" + appConst.mongoDbName, function (err) {
        if(err) {
            res.status(400);
            res.send({status:false, msg: err.message});
        } else {
            expenseModel.find({}, function(err, result) {
                if(err) {
                    res.send({status:false, msg: err.message});  
                } else {
                    res.send({status:true, msg: 'Success', expenses: result});
                }
            });
        }
    })
});


app.post("/expenses", function(req, res) {
 
});

app.delete("/delete", function(req, res) {
   
});

app.put("/update1", function (req, res) {
 
});

app.put("/update2", function (req, res) {
   
});

app.listen(appConst.Port, () => {
    console.log("Expense Manager server is on "+ appConst.Port);
});
