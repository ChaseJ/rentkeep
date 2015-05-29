Meteor.publish('property', function(propertyId) {
    check(propertyId, String);
    return Properties.find({_id: propertyId});
});

Meteor.publish('properties', function() {
    return Properties.find({userId: this.userId});
});