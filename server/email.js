Meteor.startup(function () {
    smtp = {
        username: 'rentkeep@gmail.com',
        password: '^3jZ@Zuq#8',
        server:   'smtp.gmail.com',
        port: 465
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

});

Meteor.methods({
    sendEmail: function(doc) {
        check(doc, Schemas.ContactForm);

        var text = "Name: " + doc.name + "\n\n"
            + "Email: " + doc.email + "\n\n\n\n"
            + doc.message;

        this.unblock();

        Email.send({
            to: "rentkeep@gmail.com",
            from: doc.email,
            subject: "App Contact Form - Message From " + doc.name,
            text: text
        });
    }
});