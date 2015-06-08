Template.unitView.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    var propertyId = Router.current().params.propertyId;

    instance.isMultipleUnits = new ReactiveVar(false);
    Meteor.call('isMultipleUnits', propertyId, function(error,result){
        instance.isMultipleUnits.set(result);
    });

    //Subscriptions
    instance.subscribe('unit', unitId);
    instance.subscribe('property', propertyId);

    //Data
    instance.unit = function() {
        return Units.findOne(unitId);
    };
    instance.property = function() {
        return Properties.findOne(propertyId);
    };
});

Template.unitView.helpers({
    unit: function () {
        return Template.instance().unit();
    },
    property: function() {
        return Template.instance().property();
    },
    isMultipleUnits: function() {
        return Template.instance().isMultipleUnits.get();
    }
});