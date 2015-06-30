TenantsPagination = new Paginator(Tenants);

Template.tenantsList.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('tenantId','');

    //Subscriptions
    instance.subscribe('tenants');

    //Cursors
    instance.tenants = function() {
        return TenantsPagination.find({}, {sort: {lastName: 1}, itemsPerPage:10});
    };
});

Template.tenantsList.onRendered(function () {
    $('#updateTenantModal').on('show.bs.modal', function () {
        AutoForm.resetForm('updateTenantForm');
    });
});

Template.tenantsList.helpers({
    tenants: function () {
        return Template.instance().tenants();
    }
});