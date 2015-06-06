Template.propertiesList.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('propertyId','');

    //Subscriptions
    instance.subscribe('properties');

    //Cursors
    instance.properties = function() {
        return Properties.find();
    };
});

Template.propertiesList.helpers({
    properties: function () {
        return Template.instance().properties();
    }
});