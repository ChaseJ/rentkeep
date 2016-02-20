Template.updateInvoiceModal.onCreated(function () {
    //Initialization
    var instance = this;
    instance.emailError = new ReactiveVar('');
    instance.emailSending = new ReactiveVar('');

    //Cursors
    instance.invoice = function() {
        return Invoices.findOne(Session.get('invoiceId'));
    }
});

Template.updateInvoiceModal.onRendered(function () {
    var instance = this;
    $('#updateInvoiceModal').on('hidden.bs.modal', function () {
        instance.noEmailAddresses.set('');
    })
});

Template.updateInvoiceModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateInvoiceModal').modal('hide');
    },
    'click #email-tenant': function(e){
        e.preventDefault();
        var instance = Template.instance();

        instance.emailSending.set('Email sending...');
        Meteor.call('sendInvoiceDueEmail', instance.invoice()._id, 'user', function(error, result) {
            if (error) {
                return alert(error.reason);
            } else {
                if(result === 'Email sent'){
                    instance.emailError.set('');
                } else if(result) {
                    instance.emailError.set(result);
                }
            }
            instance.emailSending.set('')
        })
    }
});

Template.updateInvoiceModal.helpers({
    'invoiceDoc': function () {
        return Template.instance().invoice();
    },
    'emailed': function() {
        var emailed = _.sortBy(Template.instance().invoice().emailed, function(o) { return o.date; });
        return _.last(emailed);
    },
    'emailError': function() {
        return Template.instance().emailError.get();
    },
    'emailSending': function() {
        return Template.instance().emailSending.get();
    }
});