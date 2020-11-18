/*
this file has all APIs to interact with the expense database.
Allows insertion, deletion, updation of expenses.
Allows user authentication.
Allows new user registration.
Deploys the server on port.
*/

// import all the constants
const appConst = require('./appConst.js');

// import express module, create an express variable 
const express = require('express');
const app = express();

// bodyParser used to parse the request body
const bodyParser = require('body-parser');

// import mongodb driver
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

// To enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE");

    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    next();
});

// Parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// this API will fetch all expenses
app.get("/expenses", function (req, res) {
    // connect to local mongodb using url
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            // connect to the database 
            const db = client.db(appConst.mongoDbName);
            // make a call to db to fetch all expenses and send the result in response
            db.collection("expense").find({}).toArray(function (err, result) {
                if (err) {
                    res.send({ status: false, msg: err.message });
                } else {
                    res.send({ status: true, msg: 'Success', expenses: result });
                }
            });
        }
    });
});

// This API will add a new expense
app.post("/expenses", function (req, res) {
    // connect to local mongodb using url
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        // doc will store all values from the request body if present.
        const doc = {}
        if (req.body.title) {
            doc.title = req.body.title
        }
        if (req.body.edate) {
            doc.edate = req.body.edate
        }
        if (req.body.amount) {
            doc.amount = req.body.amount
        }
        if (req.body.category) {
            doc.category = req.body.category
        }
        // if error while connection to mongodb
        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            // connect to the database
            const db = client.db(appConst.mongoDbName);
            // insert doc in expense 
            db.collection("expense").insertOne(doc, function (err, result) {
                if (err) {
                    res.send({ status: false, msg: 'Not inserted' });
                } else {
                    res.status(201);
                    res.send({ status: true, msg: 'Inserted Successfully', result: result });
                }
            });
        }
    });
});

// This API will delete expense with id
app.delete("/expenses", function (req, res) {
    // connect to local mongodb using url
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        // extract id from request body
        id = mongodb.ObjectID(req.body._id);
        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            // connect to the database
            const db = client.db(appConst.mongoDbName);
            // delete the expense with that id
            db.collection("expense").deleteOne({ _id: id }, function (err, result) {
                if (err) {
                    res.send({ status: false, msg: 'Not deleted' });
                } else {
                    res.status(200);
                    res.send({ status: true, msg: 'Deleted Successfully', result: result });
                }
            });
        }
    });
});

// This API updates an expense. id is accepted through param variable
app.put("/expenses/:id", function (req, res) {
    // connect to local mongodb using url
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        // extract id from params
        parameter = {
            _id: mongodb.ObjectID(req.params.id)
        }
        // doc extracts and stores new values sent through request body
        const doc = {};
        if (req.body.title) {
            doc.title = req.body.title
        }
        if (req.body.edate) {
            doc.edate = req.body.edate
        }
        if (req.body.amount) {
            doc.amount = req.body.amount
        }
        if (req.body.category) {
            doc.category = req.body.category
        }
        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            // connect to the database
            const db = client.db(appConst.mongoDbName);
            // set query for updating with new values
            var newvalues = { $set: doc };
            // update the expense
            db.collection("expense").updateOne(parameter, newvalues, function (err, result) {
                if (err) {
                    res.send({ status: false, msg: 'Not updated' });
                } else {
                    res.status(201);
                    res.send({ status: true, msg: 'Updated Successfully', result: result });
                }
            });
        }
    });
});

// This API used to update title of expense with given category
app.put("/update2", function (req, res) {
    // connect to local mongodb using url
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        // get category of expense and title that will be replaced with
        const doc = {};
        if (req.body.title) {
            doc.title = req.body.title
        }
        if (req.body.category) {
            doc.category = req.body.category
        }
        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            const db = client.db(appConst.mongoDbName);
            // query to project
            var query = { category: doc.category };
            // query to update
            var newvalues = { $set: { title: doc.title } };
            // db call to update
            db.collection("expense").updateOne(query, newvalues, function (err, result) {
                if (err) {
                    res.send({ status: false, msg: 'Not updated' });
                } else {
                    res.status(201);
                    res.send({ status: true, msg: 'Updated Successfully', result: result });
                }
            });
        }
    });
});


// This API is to register a new user
app.post("/register", function (req, res) {
    // connect to local mongodb using url
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        // get all values from request body
        const doc = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            phone: req.body.phone,
            city: req.body.city
        };

        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            // connect to the database
            const db = client.db(appConst.mongoDbName);
            // insert the record
            db.collection("users").insertOne(doc, function (err, result) {
                if (err) {
                    res.send({ status: false, msg: 'Not Registered' });
                } else {
                    res.status(201);
                    res.send({ status: true, msg: 'registered Successfully', result: result });
                }
            });
        }
    });

});

// This API call authenticates a user
app.post("/login", function (req, res) {
    // connect to local mongodb using url
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        // get user login credentials
        const doc = {
            name: req.body.name,
            password: req.body.password,
        };

        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            // connect to the database
            const db = client.db(appConst.mongoDbName);
            // fetch the user
            db.collection("users").findOne(doc, function (err, result) {
                if (err) {
                    res.send({ status: false, msg: 'user does not exist' });
                } else {
                    if (result != null) {
                        // console.log(result);
                        // console.log(result.status);
                        res.status(200);
                        res.send({ status: true, msg: 'user exists', result: result });
                    } else {
                        res.status(404);
                        res.send({ status: false, msg: 'user does not exist' })
                    }
                }
            });
        }
    });

});

// deploy server on the port
app.listen(appConst.Port, () => {
    // display msg when the server starts
    console.log("Expense Manager server is on " + appConst.Port);
});
