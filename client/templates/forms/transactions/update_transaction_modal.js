Template.updateTransactionModal.onCreated(function () {
    //Initialization
    var instance = this;
    instance.noEmailAddresses = new ReactiveVar('');

    //Cursors
    instance.trans = function() {
        return Transactions.findOne(Session.get('transactionId'));
    }
});

Template.updateTransactionModal.onRendered(function () {
    var instance = this;
    $('#updateTransactionModal').on('hidden.bs.modal', function () {
        instance.noEmailAddresses.set('');
    })
});

Template.updateTransactionModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateTransactionModal').modal('hide');
    },
    'click #email-tenant': function(e){
        e.preventDefault();
        var instance = Template.instance();

        Meteor.call('sendInvoiceDueEmail', Template.instance().trans(), 'user', function(error, result) {
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

Template.updateTransactionModal.helpers({
    'transDoc': function () {
        return Template.instance().trans();
    },
    'emailed': function() {
        var emailed = _.sortBy(Template.instance().trans().emailed, function(o) { return o.date; });
        return _.last(emailed);
    },
    'noEmailAddresses': function() {
        return Template.instance().noEmailAddresses.get();
    }
});