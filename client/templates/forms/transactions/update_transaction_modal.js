Template.updateTransactionModal.onCreated(function () {
    //Initialization
    var instance = this;

    //Cursors
    instance.trans = function() {
        return Transactions.findOne(Session.get('transactionId'));
    }
});

Template.updateTransactionModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateTransactionModal').modal('hide');
    },
    'click #email-tenant': function(e){
        e.preventDefault();
        Meteor.call('sendInvoiceDueEmail', Template.instance().trans(), 'user')
    }
});

Template.updateTransactionModal.helpers({
    'transDoc': function () {
        return Template.instance().trans();
    },
    'emailed': function() {
        var emailed = _.sortBy(Template.instance().trans().emailed, function(o) { return o.date; });
        return _.last(emailed);
    }
});