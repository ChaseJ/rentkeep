Units = new Mongo.Collection("units");

Units.attachSchema(new SimpleSchema({
    unitNo: {
        type: String,
        label: "Unit Number"
    },
    propertyId: {
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
    }
}));

Meteor.methods({
    unitUpdate: function(unitId, unitModifier){
        check(unitId, String);
        check(this.userId, Units.findOne(unitId).userId);

        Units.update(
            {_id: unitId},
            unitModifier
        );
    },
    isMultipleUnits: function(propertyId){
        return Units.find({propertyId: propertyId}).count()>1;
    }
});
