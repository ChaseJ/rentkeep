Template.removeUnitModal.events({
    'click #deleteBtn': function(e, template){
        e.preventDefault();

        var unitId = template.data.unitDoc._id;
        Meteor.call('unitRemove', unitId, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removeUnitModal').modal('hide').on('hidden.bs.modal', function () {
                    Router.go('propertiesList');
                })
            }
        });
    }
});