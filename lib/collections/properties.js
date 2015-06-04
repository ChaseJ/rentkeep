Properties = new Mongo.Collection("properties");

Properties.attachSchema(new SimpleSchema({
    'street': {
        type: String,
        label: "Street"
    },
    'city': {
        type: String,
        label: "City"
    },
    'state': {
        type: String,
        allowedValues: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"],
        autoform: {
            afFieldInput: {
                firstOption: "Select a State"
            }
        }
    },
    'postalCode': {
        type: String,
        label: "Zip"
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
    }
});
