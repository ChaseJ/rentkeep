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
    otherCharges : {
        type: Array,
        label: 'Other Charges for Tenants'
    },
    'otherCharges.$' : {
        type: Object
    },
    'otherCharges.$.desc' : {
        type: String,
        label: 'Description'
    },
    'otherExpenses.$.amt' : {
        type: Number,
        label: 'Amount'
    },
    'startDate' : {
        type: Date,
        label: 'Lease Start Date'
    },
    'endDate' : {
        type: Date,
        label: 'Lease End Date'
    },
    'paymentDueDay': {
        type: Number,
        label: 'Day of Month Payment is Due'
    },
    tenants: {
        type: Array,
        label: 'Tenants'
    },
    'tenants.$': {
        type: Object
    },
    'tenants.$.tenantId': {
        type: String,
        label: 'Tenant'
    },
    'tenants.$.primary': {
        type: Boolean,
        label: 'Primary Tenant'
    },
    'emailReminders': {
        type: Boolean,
        label: 'Yes, email primary tenants payment reminders'
    }

}));