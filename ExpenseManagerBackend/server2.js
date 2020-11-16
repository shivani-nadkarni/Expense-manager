const express = require('express');
const app = express();

app.get("/userList", function(req,res) {
    res.send(
        [
            {empname: 'jay', age: 23},
            {empname: 'shivani', age: 23}
        ]
    )
});



app.listen(5000, () => {
    console.log("Expense Manager server is on "+ 5000);
});

