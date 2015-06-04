Template.propertyPanel.onCreated(function() {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('unitsByProperty', instance.data._id);

    //Cursors
    instance.units = function() {
        return Units.find({propertyId: instance.data._id});
    };

});

Template.propertyPanel.events({
    'click tr': function(event) {
        event.preventDefault();
        Router.go('propertyView', this);
    }
});

Template.propertyPanel.helpers({
    units: function () {
        return Template.instance().units();
    },
    isMultiUnitProperty: function() {
        return Template.instance().units().count()>1;
    }
});