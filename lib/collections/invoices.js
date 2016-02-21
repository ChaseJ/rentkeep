Invoices = new Mongo.Collection("invoices");

Invoices.attachSchema(new SimpleSchema({
    leaseId: {
        type: String
    },
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
            //Fix for autovalue running when item is added to emailed
            //I don't want to run autovalue because amtDue and amtPaid are not set
            if(this.field('amtDue').value) {
                return this.field('amtDue').value - this.field('amtPaid').value;
            }
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
        optional: true,
        //Custom validation working running on update, https://github.com/aldeed/meteor-autoform/issues/1147
        custom: function() {
            if(this.field('amtPaid').value > 0 && !this.isSet) {
                return 'required';
            }
        }
    },
    refNo: {
        type: String,
        label: 'Reference #',
        optional: true,
        max: 32
    },
    emailed: {
        type: [Object],
        optional: true
    },
    "emailed.$.to": {
        type: [String]
    },
    "emailed.$.date": {
        type: Date
    },
    "emailed.$.initiatedBy": {
        type: String,
        allowedValues: ['user', 'cron']
    }
}));

Invoices.helpers({
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
        var unit = Units.findOne({_id: this.unitId});
        var property = Properties.findOne({_id: this.propertyId});
        if (property.isMultiUnit()){
            return property.street + ", Unit " + unit.unitNo;
        } else {
            return property.street;
        }
    }
});

Meteor.methods({
    invoiceInsert: function(invoiceDoc){
        check(this.userId, String);
        Invoices.insert(invoiceDoc);
    },
    invoiceUpdate: function(invoiceModifier, invoiceId){
        check(invoiceId, String);
        check(this.userId, Invoices.findOne(invoiceId).userId);

        Invoices.update(
            {_id: invoiceId},
            invoiceModifier
        );
    },
    invoiceRemove: function(invoiceId){
        check(invoiceId, String);
        check(this.userId, Invoices.findOne(invoiceId).userId);

        Invoices.remove({_id: invoiceId});
    }
});