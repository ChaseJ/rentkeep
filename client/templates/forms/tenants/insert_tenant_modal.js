Template.insertTenantModal.events({
    'click #saveBtn': function(e){
        e.preventDefault();

        if(!AutoForm.validateForm('insertTenantForm')){return;}
        var tenantDoc = AutoForm.getFormValues('insertTenantForm',null,null,false);

        Meteor.call('tenantInsert', tenantDoc, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#insertTenantModal').modal('hide');
            }
        });
    }
});