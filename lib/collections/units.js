Units = new Mongo.Collection("units");

Units.attachSchema(new SimpleSchema({
    unitNo: {
        type: String,
        label: "Unit Number"
    },
    propertyId: {
        type: String
    },
    'userId': {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    }
}));

Meteor.methods({
    unitUpdate: function(unitModifier, unitId){
        check(unitId, String);
        check(this.userId, Units.findOne(unitId).userId);

        Units.update(
            {_id: unitId},
            unitModifier
        );
    },
    unitRemove: function(unitId){
        check(unitId, String);
        check(this.userId, Units.findOne(unitId).userId);

        Units.remove({_id: unitId});

        var leases = Leases.find({unitId: unitId});
        leases.forEach(function(lease){
            Meteor.call('leaseRemove', lease._id);
        })
    },
    isMultipleUnits: function(propertyId){
        return Units.find({propertyId: propertyId}).count()>1;
    }
});
