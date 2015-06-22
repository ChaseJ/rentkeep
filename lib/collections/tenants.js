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
        autoValue: function() {
            return this.userId;
        }
    },
    'notes': {
        type: String,
        label: "Notes",
        optional: true
    }
}));

Meteor.methods({
    tenantInsert: function(tenantDoc){
        check(this.userId, String);
        Tenants.insert(tenantDoc);
    },
    tenantUpdate: function(tenantId, tenantModifier){
        check(tenantId, String);
        check(this.userId, Tenants.findOne(tenantId).userId);

        Tenants.update(
            {_id: tenantId},
            tenantModifier
        );
    },
    tenantRemove: function(tenantId){
        check(tenantId, String);
        check(this.userId, Tenants.findOne(tenantId).userId);

        Tenants.remove({_id: tenantId});
    }
});