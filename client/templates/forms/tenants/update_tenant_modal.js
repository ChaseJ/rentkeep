Template.updateTenantModal.onCreated(function(){
   console.log(Router.current());
});

Template.updateTenantModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateTenantModal').modal('hide');
    }
});

Template.updateTenantModal.helpers({
    'tenantDoc': function () {
        var tenantId = Session.get('tenantId');
        return tenantId==='' ? false : Tenants.findOne(tenantId);
    },
    'isTenantsURL': function() {
        return Router.current().url === '/tenants';
    }
});