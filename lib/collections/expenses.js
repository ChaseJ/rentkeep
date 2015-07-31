Expenses = new Mongo.Collection("expenses");

Expenses.attachSchema(new SimpleSchema({
    propertyId: {
        type: String
    },
    unitId: {
        //Value of property means expense should not apply to a specific unit
        type: String,
        label: 'Assign Expense To'
    },
    userId: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    expDate: {
        type: Date,
        label: 'Date'
    },
    payee: {
        type: String,
        label: 'Payee',
        optional: true,
        max: 64
    },
    desc: {
        type: String,
        label: 'Description',
        max: 64
    },
    amount: {
        type: Number,
        label: 'Amount',
        max: 1000000,
        min: 0
    },
    notes: {
        type: String,
        label: 'Notes',
        optional: true,
        max: 1024
    }
}));

Meteor.methods({
    expenseInsert: function(expenseDoc){
        check(this.userId, String);
        Expenses.insert(expenseDoc);
    }
});