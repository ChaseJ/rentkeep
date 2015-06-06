Template.removePropertyModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();

        Meteor.call('propertyRemove', Session.get('propertyId'), function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removePropertyModal').modal('hide');
            }
        });
    }
});