Tenants = new Mongo.Collection("tenants");

Tenants.initEasySearch(['firstName', 'lastName', 'phone', 'email'], {'limit' : 10});

Tenants.attachSchema(new SimpleSchema({
    firstName: {
        type: String,
        label: "First Name"
    },
    lastName: {
        type: String,
        label: "Last Name"
    },
    phone: {
        type: String,
        optional: true,
        label: "Phone Number"
    },
    email: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Email,
        label: "Email Address"
    },
    'userId': {
        type: String,
        autoform: {
            omit: true
        },
        autoValue: function() {
            return this.userId;
        }
    }
}));

Meteor.methods({
    tenantInsert: function(tenantDoc){
        check(this.userId, String);
        Tenants.insert(tenantDoc);
    }
});