Template.home.onCreated(function () {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('unpaidInvoices');
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');

    //Cursors
    instance.units = function() {
        return Units.find({});
    };
});

Template.home.helpers({
    hasUnits: function() {
        return Template.instance().units().count()>0;
    }
});