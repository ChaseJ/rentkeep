Template.removeTransactionModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();

        Meteor.call('transactionRemove', Session.get('transactionId'), function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removeTransactionModal').modal('hide');
            }
        });
    }
});