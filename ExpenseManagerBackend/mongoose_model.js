const mongoose = require('mongoose');

const ExpenseSchema = mongoose.Schema;

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

const ExpenseModel = mongoose.model("Expense", expenseSchema);

module.exports = ExpenseModel;