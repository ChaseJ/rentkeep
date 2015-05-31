Tenants = new Mongo.Collection("tenants");

Tenants.attachSchema(new SimpleSchema({
    firstName: {
        type: String,
        label: "First Name"
    },
    lastName: {
        type: String,
        label: "Last Name"
    },
    phone: {
        type: String,
        optional: true,
        label: "Phone Number"
    },
    email: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Email,
        label: "E-mail Address"
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