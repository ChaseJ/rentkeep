//Email smtp setup
Meteor.startup(function () {
    smtp = {
        username: 'rentkeep@gmail.com',
        password: '^3jZ@Zuq#8',
        server:   'smtp.gmail.com',
        port: 465
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

});


//Accounts package config
Meteor.startup(function() {

    Accounts.emailTemplates.from = 'RentKeep <no-reply@rentkeep.com>';

    Accounts.emailTemplates.siteName = 'RentKeep';

    Accounts.emailTemplates.resetPassword.subject = function() {
        return 'Reset your RentKeep password';
    };

    Accounts.emailTemplates.resetPassword.text = function(user, url) {
        url = url.replace('#/', '');
        return "Click this link to reset your password: " + url;
    };
});


//Email methods
Meteor.methods({
    sendContactFormEmail: function(doc) {
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
    },
    sendInvoiceDueEmail: function(invoiceId, initiatedBy) {
        var invoice = Invoices.findOne(invoiceId);
        var lease = Leases.findOne(invoice.leaseId);
        var tenants = Tenants.find({_id: {$in: lease.tenants} });
        var emailArray = [];
        var now = new Date();

        tenants.forEach(function(tenant){
            if(tenant.email){
                emailArray.push(tenant.email);
            }
        });

        if(emailArray.length === 0) {
            return 'Can\'t send mail - no recipients defined';
        } else {
            this.unblock();

            try {
                Email.send({
                    to: emailArray,
                    from: 'RentKeep <no-reply@rentkeep.com>',
                    subject: "You have an invoice due",
                    html: SSR.render('emailLayout', {
                        template: "invoiceDueEmail",
                        data: invoice
                    })
                });

                invoiceModifier = {
                    $push: {
                        emailed: {
                            to: emailArray,
                            date: now,
                            initiatedBy: initiatedBy
                        }
                    }
                };

                Invoices.update({_id: invoiceId}, invoiceModifier);

                return 'Email sent';

            } catch (e) {
                return e.message;
            }
        }
    }
});