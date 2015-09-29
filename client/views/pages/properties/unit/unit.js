Template.unit.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    var propertyId = Router.current().params.propertyId;

    instance.isMultiUnit = new ReactiveVar(false);
    Meteor.call('isMultiUnit', propertyId, function(error,result){
        instance.isMultiUnit.set(result);
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

Template.unit.helpers({
    unit: function () {
        return Template.instance().unit();
    },
    property: function() {
        return Template.instance().property();
    },
    isMultiUnit: function() {
        return Template.instance().isMultiUnit.get();
    }
});