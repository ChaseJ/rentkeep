Template.removeLeaseModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();

        Meteor.call('leaseRemove', Session.get('leaseId'), function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removeLeaseModal').modal('hide');
            }
        });
    }
});