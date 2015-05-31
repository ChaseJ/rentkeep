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