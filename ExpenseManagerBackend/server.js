const appConst = require('./appConst.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const axios = require('axios');

const mongodb = require("mongodb"); //driver
const { Port, mongoDbUrl } = require('./appConst.js');
const { default: Axios } = require('axios');
const mongoClient = mongodb.MongoClient;

app.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE");
    
    res.header("Access-Control-Allow-Methods", "DELETE, PUT");
    next();
});

// app.use(function(req, res, next) {​​​​​
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// }​​​​​);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// base url
app.use('/', express.static("./pages/home"));

app.use('/loginpage', express.static("./pages/login"));

app.use('/registerpage', express.static("./pages/register"));

app.use("/aboutus", express.static('./pages/aboutus'));

app.get("/expenses", function(req, res) {
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function(err, client) {
        if(err) {
            res.status(400);
            res.send({status:false, msg: err.message});
        } else {
            const db = client.db(appConst.mongoDbName);
            db.collection("expense").find({}).toArray(function(err, result) {
                if(err) {
                    res.send({status:false, msg: err.message});
                } else {
                    res.send({status:true, msg: 'Success', expenses: result});
                }
            });
        }
    });
});

app.post("/expenses", function(req, res) {
    mongoClient.connect(appConst.mongoDbUrl,{ useUnifiedTopology: true }, function(err, client) {
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
        
        if(err) {
            res.status(400);
            res.send({status:false, msg: err.message});
        } else {
            const db = client.db(appConst.mongoDbName);

            db.collection("expense").insertOne(doc, function(err, result) {
                if(err) {
                    res.send({status: false, msg: 'Not inserted'});
                } else {
                    res.status(201);
                    res.send({status: true, msg: 'Inserted Successfully', result: result});
                }
            });
        }
    });
});

app.delete("/expenses", function(req, res) {
    mongoClient.connect(appConst.mongoDbUrl,{ useUnifiedTopology: true }, function(err, client) {
        id = mongodb.ObjectID(req.body._id);
        // category = req.body.category
        console.log(id);
        if(err) {
            res.status(400);
            res.send({status:false, msg: err.message});
        } else {
            const db = client.db(appConst.mongoDbName);

            db.collection("expense").deleteOne({ _id: id}, function(err, result) {
                if(err) {
                    res.send({status: false, msg: 'Not deleted'});
                } else {
                    res.status(200);
                    res.send({status: true, msg: 'Deleted Successfully', result: result});
                }
            });
        }
    });
});

app.put("/expenses/:id", function (req, res) {
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        parameter = {
            _id: mongodb.ObjectID(req.params.id)
        }
        
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
            const db = client.db(appConst.mongoDbName);
            //var query = { id: req.par };
            var newvalues = { $set: doc};
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

app.put("/update2", function (req, res) {
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
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
            var query = { category: doc.category };
            var newvalues = { $set: { title: doc.title } };
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

app.listen(appConst.Port, () => {
    console.log("Expense Manager server is on "+ appConst.Port);
});

app.get("/userList", function(req, res) {
    //Axios.getUri
    axios.get(appConst.userList)
    .then(function(data) {
        res.send({status:true, data:data});
    })
    .catch(function (err){
        res.send({status:false, error:err});
    });
});

app.post("/register", function(req, res){
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
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
            const db = client.db(appConst.mongoDbName);
            db.collection("users").insertOne(doc, function(err, result) {
                if (err) {
                    res.send({ status: false, msg: 'Not Registered' });
                } else {
                    res.status(201);
                    res.send({ status: true, msg: 'registered Successfully', result: result });
                }
            });
        }
    });

}) ;

app.post("/login", function(req, res){
    mongoClient.connect(appConst.mongoDbUrl, { useUnifiedTopology: true }, function (err, client) {
        const doc = {
            name: req.body.name,
            password: req.body.password,
        };
        
        if (err) {
            res.status(400);
            res.send({ status: false, msg: err.message });
        } else {
            const db = client.db(appConst.mongoDbName);
            db.collection("users").findOne(doc, function(err, result) {
                if (err) {
                    res.send({ status: false, msg: 'user does not exist'});
                } else {
                    if(result != null) {
                        console.log(result);
                        console.log(result.status);
                        res.status(200);
                        res.send({ status: true, msg: 'user exists', result: result });
                    } else {
                        res.status(404);
                        res.send({ status: false, msg: 'user does not exist'})
                    }
                }
            });
        }
    });

}) ;
