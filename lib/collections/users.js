//Schemas is defined in contact.js

Schemas.UserProfile = new SimpleSchema({
    companyName: {
        type: String,
        label: "Company Name",
        max: 64
    },
    firstName: {
        type: String,
        label: "First Name",
        max: 32
    },
    lastName: {
        type: String,
        label: "Last Name",
        max: 32
    }
});

Schemas.User = new SimpleSchema({
    profile: {
        type: Schemas.UserProfile
    }
});