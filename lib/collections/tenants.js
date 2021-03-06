Tenants = new Mongo.Collection("tenants");

Tenants.initEasySearch(['firstName', 'lastName', 'phone', 'email'], {'limit' : 10});

Tenants.attachSchema(new SimpleSchema({
    firstName: {
        type: String,
        label: "First Name",
        max: 64
    },
    lastName: {
        type: String,
        label: "Last Name",
        max: 64
    },
    phone: {
        type: String,
        optional: true,
        label: "Phone Number",
        max: 32
    },
    email: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Email,
        label: "Email Address"
    },
    userId: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    notes: {
        type: String,
        label: "Notes",
        optional: true,
        max: 1024
    }
}));

Tenants.helpers({
    leases: function() {
        return Leases.find({tenants: this._id}).fetch();
    }
});

Meteor.methods({
    tenantInsert: function(tenantDoc){
        check(this.userId, String);
        Tenants.insert(tenantDoc);
    },
    tenantUpdate: function(tenantModifier, tenantId){
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

        Leases.update(
            {tenants: tenantId},
            {$pull:{tenants: tenantId}},
            {multi: true}
        );
    }
});