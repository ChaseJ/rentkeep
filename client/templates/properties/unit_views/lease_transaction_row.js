Template.leaseTransactionRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('transactionId',Template.instance().data._id);
    }
});