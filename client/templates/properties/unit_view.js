Template.unitView.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    var propertyId = Router.current().params.propertyId;

    //Subscriptions
    instance.subscribe('unit', unitId);
    instance.subscribe('property', propertyId);

    //Cursors
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
    }
});