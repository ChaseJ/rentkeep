Template.removeTenantModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();

        Meteor.call('tenantRemove', Session.get('tenantId'), function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removeTenantModal').modal('hide');
            }
        });
    }
});