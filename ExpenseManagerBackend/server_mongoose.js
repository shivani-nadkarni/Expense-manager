/*
This is replication of server.js, with the only difference 
that it uses 'mongoose' module to declare 'expense' schema.
Thus reducing boilerplate code.
This is for testing purpose.
Only one API(to fetch expenses) is implemented here.
*/

// load all constants
const appConst = require('./appConst.js');

// import express and create express variable
const express = require('express');
const app = express();

// import mongoose and expense schema model 
const mongoose = require('mongoose');
const expenseModel = require('./mongoose_model');

// body parser is used to parse request body
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// API to fetch all expenses
app.get("/expenses", function(req, res) {
    // connect to expense database, using database url
    mongoose.connect(appConst.mongoDbUrl + "/" + appConst.mongoDbName, function (err) {
        if(err) {
            res.status(400);
            res.send({status:false, msg: err.message});
        } else {
            // fetch all expenses
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

// deploy the server on the port
app.listen(appConst.Port, () => {
    console.log("Expense Manager server is on "+ appConst.Port);
});
