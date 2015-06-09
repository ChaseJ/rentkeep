PropertiesPagination = new Paginator(Properties);

Template.propertiesList.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('propertyId','');

    //Subscriptions
    instance.subscribe('properties');

    //Cursors
    instance.properties = function() {
        return PropertiesPagination.find({}, {sort: {street: 1}, itemsPerPage:10});
    };
});

Template.propertiesList.helpers({
    properties: function () {
        return Template.instance().properties();
    }
});