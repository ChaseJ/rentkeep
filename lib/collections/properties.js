Properties = new Mongo.Collection("properties");

Properties.initEasySearch(['street', 'city', 'state'], {'limit' : 10});

Properties.attachSchema(new SimpleSchema({
    street: {
        type: String,
        label: "Street",
        max: 64
    },
    city: {
        type: String,
        label: "City",
        max: 64
    },
    state: {
        type: String,
        allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
        autoform: {
            afFieldInput: {
                firstOption: "Select a State"
            }
        }
    },
    postalCode: {
        type: String,
        label: "Zip",
        max: 32
    },
    userId: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    }

}));

Properties.helpers({
    isMultiUnit: function() {
        var units = Units.find({propertyId: this._id});
        return units.count() > 1;
    }
});

Meteor.methods({
    propertyInsert: function(propertyDoc, unitArray){
        check(this.userId, String);

        var propertyId = Properties.insert(propertyDoc);

        unitArray = _.compact(unitArray);
        var unitDoc;
        if(unitArray.length === 0) {
            unitDoc = {unitNo: "1", propertyId: propertyId};
            Units.insert(unitDoc);
        } else {
            for (var i = 0; i < unitArray.length; i++) {
                unitDoc = {unitNo: unitArray[i], propertyId: propertyId};
                if(typeof unitDoc.unitNo === 'string'){
                    Units.insert(unitDoc);
                }
            }
        }
    },

    propertyRemove: function(propertyId){
        check(propertyId, String);
        check(this.userId, Properties.findOne(propertyId).userId);

        Properties.remove({_id: propertyId});

        var units = Units.find({propertyId: propertyId});
        units.forEach(function(unit){
            Meteor.call('unitRemove', unit._id);
        });

        Expenses.remove({propertyId: propertyId});
    },

    propertyUpdate: function(propertyId, propertyModifier, unitArray){
        check(propertyId, String);
        check(this.userId, Properties.findOne(propertyId).userId);

        Properties.update(
            {_id: propertyId},
            propertyModifier
        );

        unitArray = _.compact(unitArray);
        var unitDoc;
        for (var i = 0; i < unitArray.length; i++) {
            unitDoc = {unitNo: unitArray[i], propertyId: propertyId};
            if(typeof unitDoc.unitNo === 'string'){
                Units.insert(unitDoc);
            }
        }
    },

    isMultiUnit: function(propertyId){
        return Units.find({propertyId: propertyId}).count()>1;
    }
});
