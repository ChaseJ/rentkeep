Expenses = new Mongo.Collection("expenses");

Expenses.attachSchema(new SimpleSchema({
    propertyId: {
        type: String
    },
    unitId: {
        type: String
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