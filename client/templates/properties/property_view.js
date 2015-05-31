Template.propertyView.onCreated(function () {
    //Initialization
    var instance = this;
    var propertyId = Router.current().params._id;

    //Subscriptions
    instance.subscribe('property', propertyId);
    instance.subscribe('unitsByProperty', propertyId);

    //Cursors
    instance.property = function() {
        return Properties.findOne(propertyId);
    };
    instance.units = function() {
        return Units.find();
    };
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
    },
    units: function () {
        return Template.instance().units();
    }
});