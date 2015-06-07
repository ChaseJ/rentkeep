PropertiesPagination = new Paginator(Properties);

Template.propertiesList.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('propertyId','');

    //Subscriptions
    instance.subscribe('properties');
});

Template.propertiesList.helpers({
    properties: function () {
        return PropertiesPagination.find({}, {sort: {street: 1}, itemsPerPage:10});
    }
});