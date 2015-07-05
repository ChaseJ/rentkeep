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
    'balance' : {
        type: Number,
        label: 'Balance',
        decimal: true,
        autoValue: function() {
            return this.field('amtDue').value - this.field('amtPaid').value;
        }
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

Transactions.helpers({
    status: function() {
        if(this.balance > 0){
            //Because moment() is local time, and dueDate is UTC midnight,
            //I have to add the timezone offset to compare days
            if(moment().isAfter(moment(this.dueDate).add(moment().zone(),"m"), 'day')){
                return 'Late'
            } else {
                return 'Open'
            }
        } else {
            return 'Paid'
        }
    },
    streetAndUnit: function() {
        var lease = Leases.findOne({_id: this.leaseId});
        var unit = Units.findOne({_id: lease.unitId});
        var property = Properties.findOne({_id: unit.propertyId});
        if (property.isMultiUnit()){
            return property.street + ", Unit " + unit.unitNo;
        } else {
            return property.street;
        }
    }
});

Meteor.methods({
    transactionInsert: function(transDoc){
        check(this.userId, String);
        Transactions.insert(transDoc);
    },
    transactionUpdate: function(transModifier, transId){
        check(transId, String);
        check(this.userId, Transactions.findOne(transId).userId);

        Transactions.update(
            {_id: transId},
            transModifier
        );
    },
    transactionRemove: function(transId){
        check(transId, String);
        check(this.userId, Transactions.findOne(transId).userId);

        Transactions.remove({_id: transId});
    }
});