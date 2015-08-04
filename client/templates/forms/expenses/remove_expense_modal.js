Template.removeExpenseModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();

        Meteor.call('expenseRemove', Session.get('expenseId'), function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removeExpenseModal').modal('hide');
            }
        });
    }
});