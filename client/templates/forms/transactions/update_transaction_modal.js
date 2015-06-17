Template.updateTransactionModal.events({
    'click #saveBtn': function(e){
        e.preventDefault();

        if(!AutoForm.validateForm('updateTransactionForm')){return;}
        var transModifier = AutoForm.getFormValues('updateTransactionForm',null,null,true);

        Meteor.call('transactionUpdate', Session.get('transactionId'), transModifier, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#updateTransactionModal').modal('hide');
            }
        });
    }
});

Template.updateTransactionModal.helpers({
    'transDoc': function () {
        var transId = Session.get('transactionId');
        return transId==='' ? false : Transactions.findOne(transId);
    }
});