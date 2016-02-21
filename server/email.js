//Email smtp setup
Meteor.startup(function () {
    smtp = {
        username: 'rentkeep@gmail.com',
        password: 'J#6^y&J8bRCK',
        server:   'smtp.gmail.com',
        port: 465
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
    var oneDay = 86400000;
    Meteor.setInterval(sendDailyInvoices, oneDay);
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

//server side functions
var sendDailyInvoices = function() {
    var dueInvoiceCollection = Invoices.find({});

    dueInvoiceCollection.forEach(function(dueInvoice) {
        var lease = Leases.findOne(dueInvoice.leaseId);
        var tenants = Tenants.find({_id: {$in: lease.tenants}});
        var flag = false;

        /* Checks through a list of tenants in
         * that invoice to see if they are tests
         * or not.                               */
         tenants.forEach(function(tenant) {
            if(tenant.email.contains("@example.com")) {
                flag = true;
           }

        });

        if(flag) {
            //do nothing

        } else {
            var oneWeekUntil = new Date();
            oneWeekUntil.setDate(dueInvoice.dueDate.getDate() - 7);

            var oneWeekAfter = new Date();
            oneWeekAfter.setDate(dueInvoice.dueDate.getDate() + 7);

            var today = new Date();

            var dueInWeek = today.getDay() === oneWeekUntil.getDay();

            var overDueWeek = today.getDay() === oneWeekAfter.getDay();

            var dueToday = today.getDay() === dueInvoice.dueDate.getDay();

            var needsPaid = dueInvoice.amtPaid < dueInvoice.amtDue;


            /*
             * if today is the day the invoice is due and
             * the invoice is not paid send a new invoice */
            if (dueToday && needsPaid) {

                Meteor.call('sendInvoiceDueEmail', dueInvoice._id, 'cron', function (error) {
                    if (error) {
                        console.log("There was an error in sendDailyInvoices");
                        return alert(error.reason);
                    }
                })
            }

            /*
             * if the due date minus 7 days is the same as today
             * and the amount is not paid send an invoice             */
            else if (dueInWeek && needsPaid) {

                Meteor.call('sendInvoiceDueEmail', dueInvoice._id, 'cron', function (error) {
                    if (error) {
                        console.log("There was an error in sendDailyInvoices");
                        return alert(error.reason);
                    }
                })
            }

            /*
             * if the due date plus 7 days is the same as today
             * and the amount is not paid send an invoice             */
            else if (overDueWeek && needsPaid) {
                Meteor.call('sendInvoiceDueEmail', dueInvoice._id, 'cron', function (error) {
                    if (error) {
                        console.log("There was an error in sendDailyInvoices");
                        return alert(error.reason);
                    }
                })
            }
        }
    });
};

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