Template.updateInvoiceModal.onCreated(function () {
    //Initialization
    var instance = this;
    instance.noEmailAddresses = new ReactiveVar('');

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

        Meteor.call('sendInvoiceDueEmail', Template.instance().invoice(), 'user', function(error, result) {
            if (error) {
                return alert(error.reason);
            } else {
                if(result === 'Email sent'){
                    instance.noEmailAddresses.set('');
                } else if(result) {
                    instance.noEmailAddresses.set(result);
                }
            }
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
    'noEmailAddresses': function() {
        return Template.instance().noEmailAddresses.get();
    }
});