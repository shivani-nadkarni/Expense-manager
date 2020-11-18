/*
define the expense schema 
export it to be used in the server file
*/

//import the mongoose module
const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema;

// define schema for expense
const expenseSchema = new ExpenseSchema(
    {
        category: String,
        title: String,
        amount: Number,
        edate: Date
    },
    {
        collection: 'expense'
    }
);

// create expense model to store expense schema
const ExpenseModel = mongoose.model("Expense", expenseSchema);

// export the expense model
module.exports = ExpenseModel;