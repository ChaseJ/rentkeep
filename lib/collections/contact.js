Schemas = {};

Schemas.ContactForm = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
        max: 64
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        label: "Email"
    },
    subject: {
        type: String,
        label: "Subject",
        max: 256
    },
    message: {
        type: String,
        label: "Message",
        max: 1024
    }
});