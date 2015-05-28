Template.propertyView.onCreated(function () {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('property', Router.current().params._id);

    //Cursors
    instance.property = function() {
        return Properties.findOne(Router.current().params._id);
    }
});

Template.propertyView.helpers({
    property: function () {
        return Template.instance().property();
    }
});