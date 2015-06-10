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
        label: 'Amount Due'
    },
    'amtPaid' : {
        type: Number,
        label: 'Amount Paid'
    },
    'notes' : {
        type: String,
        label: 'Notes'
    },
    'status' : {
        type: String,
        allowedValues: ['Paid', 'Late', 'Open']
    }
}));