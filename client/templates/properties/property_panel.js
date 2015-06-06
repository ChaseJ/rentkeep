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
    'click .panel-heading-update': function(e) {
        e.preventDefault();
        Session.set('propertyId',Template.instance().data._id);
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