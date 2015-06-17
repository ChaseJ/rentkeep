Transactions = new Mongo.Collection("transactions");

Transactions.attachSchema(new SimpleSchema({
    leaseId: {
        type: String
    },
    'userId': {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    'dueDate' : {
        type: Date,
        label: 'Due Date'
    },
    'desc' : {
        type: String,
        label: 'Description'
    },
    'amtDue' : {
        type: Number,
        label: 'Amount Due',
        decimal: true
    },
    'amtPaid' : {
        type: Number,
        label: 'Amount Paid',
        decimal: true,
        defaultValue: 0
    },
    'notes' : {
        type: String,
        label: 'Notes',
        optional: true
    },
    'paidDate' : {
        type: Date,
        label: 'Paid Date',
        optional: true
    },
    'refNo' : {
        type: String,
        label: 'Reference #',
        optional: true
    }
}));

Meteor.methods({
    transactionInsert: function(transDoc){
        check(this.userId, String);
        Transactions.insert(transDoc);
    }
});