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
    status: function() {
        var leases = Leases.find({tenants: this._id});
        var status = [];
        var current = false;
        var past = false;
        var future = false;

        leases.forEach(function(lease){
            if(!current && lease.status()==='current'){
                status.push('current');
                current = true;
            } else if(!past && lease.status()==='past') {
                status.push('past');
                past = false;
            } else if(!future && lease.status()==='future') {
                status.push('future');
                future = false;
            }
        });

        return status;
    },
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