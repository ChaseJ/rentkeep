Properties = new Mongo.Collection("properties");

Properties.attachSchema(new SimpleSchema({
    name: {
        type: String,
        label: "Property Name"
    },
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
    'multiUnit': {
        type: Boolean,
        label: "Yes, this property has multiple units."
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