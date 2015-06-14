Leases = new Mongo.Collection("leases");

Leases.attachSchema(new SimpleSchema({
    unitId: {
        type: String
    },
    'userId': {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    'rentAmt' : {
        type: Number,
        label: 'Rent',
        decimal: true
    },
    'depositAmt' : {
        type: Number,
        label: 'Deposit',
        decimal: true,
        optional: true
    },
    'startDate' : {
        type: Date,
        label: 'Start Date'
    },
    'endDate' : {
        type: Date,
        label: 'End Date',
        custom: function() {
            if(this.value <= this.field('startDate').value){
                return 'endDateBeforeStart'
            }
        }
    },
    tenants: {
        type: [String],
        label: 'Tenants'
    }
}));

SimpleSchema.messages({
   'endDateBeforeStart' : 'End date must be after start date.'
});

Meteor.methods({
    leaseInsert: function(leaseDoc){
        check(this.userId, String);
        Leases.insert(leaseDoc);
    }
});