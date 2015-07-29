Transactions = new Mongo.Collection("transactions");

Transactions.attachSchema(new SimpleSchema({
    leaseId: {
        type: String
    },
    userId: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    dueDate: {
        type: Date,
        label: 'Due Date'
    },
    desc: {
        type: String,
        label: 'Description',
        max: 64
    },
    amtDue: {
        type: Number,
        label: 'Amount Due',
        decimal: true,
        max: 1000000
    },
    amtPaid: {
        type: Number,
        label: 'Amount Paid',
        decimal: true,
        defaultValue: 0,
        max: 1000000,
        min: 0
    },
    balance: {
        type: Number,
        label: 'Balance',
        decimal: true,
        autoValue: function() {
            return this.field('amtDue').value - this.field('amtPaid').value;
        }
    },
    notes: {
        type: String,
        label: 'Notes',
        optional: true,
        max: 1024
    },
    paidDate: {
        type: Date,
        label: 'Paid Date',
        optional: true
    },
    refNo: {
        type: String,
        label: 'Reference #',
        optional: true,
        max: 32
    }
}));

Transactions.helpers({
    status: function() {
        //Because moment() is local time, and dueDate is UTC midnight,
        //I have to add the timezone offset to compare days
        var isLate = moment().isAfter(moment(this.dueDate).subtract(moment().utcOffset(),"m"), 'day');

        if (this.balance === 0) {
            return 'Paid';
        } else if (this.balance < 0) {
            return 'Overpaid';
        } else if (this.balance === this.amtDue) {
            if (isLate) {
                return 'Late';
            } else {
                return 'Open';
            }
        } else if (this.balance < this.amtDue) {
            if (isLate) {
                return 'Late (Partial)';
            } else {
                return 'Open (Partial)';
            }
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