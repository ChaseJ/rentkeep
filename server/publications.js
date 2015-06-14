Meteor.publish('property', function(propertyId) {
    check(propertyId, String);
    return Properties.find({_id: propertyId});
});

Meteor.publish('properties', function() {
    return Properties.find({userId: this.userId});
});

Meteor.publish('unitsByProperty', function(propertyId) {
    check(propertyId, String);
    return Units.find({propertyId: propertyId});
});

Meteor.publish('unit', function(unitId) {
    check(unitId, String);
    return Units.find({_id: unitId});
});

Meteor.publish('tenants', function() {
    return Tenants.find({userId: this.userId});
});

Meteor.publish('tenantsById', function(tenantIds) {
    check(tenantIds, [String]);
    return Tenants.find({_id: {$in: tenantIds} });
});

Meteor.publish('activeLeaseByUnit', function(unitId) {
    check(unitId, String);
    var today = new Date();
    return Leases.find({unitId: unitId, endDate: { $gte: today }});
});