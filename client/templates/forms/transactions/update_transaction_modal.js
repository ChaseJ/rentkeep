Template.updateTransactionModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateTransactionModal').modal('hide');
    }
});

Template.updateTransactionModal.helpers({
    'transDoc': function () {
        var transId = Session.get('transactionId');
        return transId==='' ? false : Transactions.findOne(transId);
    }
});