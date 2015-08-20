TenantsPagination = new Paginator(Tenants);

Template.tenantsList.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('tenantId','');

    //Subscriptions
    instance.subscribe('tenants');

    //Cursors
    instance.tenantsPagination = function() {
        return TenantsPagination.find({}, {sort: {lastName: 1}, itemsPerPage:10});
    };
    instance.tenants = function() {
        return Tenants.find({}, {sort: {lastName: 1}});
    };
});

Template.tenantsList.onRendered(function () {
    $('#updateTenantModal').on('hidden.bs.modal', function () {
        AutoForm.resetForm('updateTenantForm');
    });
});

Template.tenantsList.events({
    'click .export-btn': function(e) {
        e.preventDefault();
        var tenantsArray = Template.instance().tenants().map(function(tenant, index) {
            //Show optional properties if not declared yet
            if(index===0) {
                if(!tenant.hasOwnProperty('phone')) {transaction.phone=''}
                if(!tenant.hasOwnProperty('email')) {tenant.email=''}
                if(!tenant.hasOwnProperty('notes')) {tenant.notes=''}
            }
            return _.omit(tenant, ['userId', "_id"]);
        });
        var csv = Papa.unparse(tenantsArray);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "tenants.csv");
    }
});

Template.tenantsList.helpers({
    tenants: function () {
        return Template.instance().tenantsPagination();
    }
});