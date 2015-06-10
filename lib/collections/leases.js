Leases = new Mongo.Collection("leases");

Leases.attachSchema(new SimpleSchema({
    unitId: {
        type: String,
        autoform: {
            omit: true
        }
    },
    'userId': {
        type: String,
        autoform: {
            omit: true
        },
        autoValue: function() {
            return this.userId;
        }
    },
    'rentAmt' : {
        type: Number,
        label: 'Rent'
    },
    'depositAmt' : {
        type: Number,
        label: 'Deposit',
        optional: true
    },
    'startDate' : {
        type: Date,
        label: 'Start Date'
    },
    'endDate' : {
        type: Date,
        label: 'End Date'
    },
    tenants: {
        type: [String],
        label: 'Tenants',
        minCount: 1
    }
}));