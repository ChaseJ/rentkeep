//Schemas is defined in contact.js

Schemas.UserProfile = new SimpleSchema({
    companyName: {
        type: String,
        label: "Company Name"
    },
    firstName: {
        type: String,
        label: "First Name"
    },
    lastName: {
        type: String,
        label: "Last Name"
    }
});

Schemas.User = new SimpleSchema({
    profile: {
        type: Schemas.UserProfile
    }
});