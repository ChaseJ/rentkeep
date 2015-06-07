Template.propertyPanel.onCreated(function() {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('unitsByProperty', instance.data._id);

    //Cursors
    instance.units = function() {
        return Units.find({propertyId: instance.data._id},{sort: {unitNo: 1}});
    };

});

Template.propertyPanel.events({
    'click .panel-heading-update': function(e) {
        e.preventDefault();
        Session.set('propertyId',Template.instance().data._id);
    },
    'click .panel-heading-remove': function(e) {
        e.preventDefault();
        Session.set('propertyId',Template.instance().data._id);
    },
    'click .single-unit-link': function(e) {
        e.preventDefault();
        Router.go('unitView', Units.findOne({propertyId: this._id}));

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