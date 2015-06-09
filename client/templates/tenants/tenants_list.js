TenantsPagination = new Paginator(Tenants);


Template.tenantsList.onCreated(function () {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('tenants');
});

Template.tenantsList.helpers({
    tenants: function () {
        return TenantsPagination.find({}, {sort: {lastName: 1}, itemsPerPage:10});
    }
});