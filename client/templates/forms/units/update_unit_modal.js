Template.updateUnitModal.events({
    'click #saveBtn': function(e, template){
        e.preventDefault();

        if(!AutoForm.validateForm('updateUnitForm')){return;}
        var unitModifier = AutoForm.getFormValues('updateUnitForm',null,null,true);
        var unitId = template.data.unitDoc._id;

        Meteor.call('unitUpdate', unitId, unitModifier, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#updateUnitModal').modal('hide');
            }
        });
    }
});