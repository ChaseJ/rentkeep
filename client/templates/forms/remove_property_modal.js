Template.removePropertyModal.onRendered(function() {
    var instance = this;
    instance.propertyId = new ReactiveVar();

    $('#removePropertyModal').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        instance.propertyId.set(button.data('property-id'));
    })
});

Template.removePropertyModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();

        Meteor.call('propertyRemove', Template.instance().propertyId.get(), function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removePropertyModal').modal('hide');
            }
        });
    }
});