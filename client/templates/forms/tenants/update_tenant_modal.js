Template.updateTenantModal.events({
    'click #saveBtn': function(e){
        e.preventDefault();

        if(!AutoForm.validateForm('updateTenantForm')){return;}
        var tenantModifier = AutoForm.getFormValues('updateTenantForm',null,null,true);

        Meteor.call('tenantUpdate', Session.get('tenantId'), tenantModifier, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#updateTenantModal').modal('hide');
            }
        });
    }
});

Template.updateTenantModal.helpers({
    'tenantDoc': function () {
        var tenantId = Session.get('tenantId');
        return tenantId==='' ? false : Tenants.findOne(tenantId);
    }
});