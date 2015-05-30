Template.propertyView.onCreated(function () {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('property', Router.current().params._id);
    instance.subscribe('unitsByProperty', Router.current().params._id);

    //Cursors
    instance.property = function() {
        return Properties.findOne(Router.current().params._id);
    }
});

Template.propertyView.helpers({
    property: function () {
        return Template.instance().property();
    },
    removePropertyHook: function() {
        //When the operation is remove, I must use the onSuccess parameter,
        //instead of just adding a onSuccess hook
        return function(){
            $('#afModal').on('hidden.bs.modal', function () {
                Router.go('propertiesList');
            });
        };
    }
});