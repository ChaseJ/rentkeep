Template.tenantsList.onCreated(function () {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('tenants');

    //Cursors
    instance.tenants = function() {
        return Tenants.find();
    }
});

Template.tenantsList.helpers({
    tenants: function () {
        return Template.instance().tenants();
    }
});