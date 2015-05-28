var insertPropertyHook = {
    onSuccess: function(formType, result) {
        //Once modal is done fading out, go to property
        $('#afModal').on('hidden.bs.modal', function () {
            Router.go('propertyView', {_id: result});
        })
    }
};

AutoForm.addHooks('insertPropertyForm', insertPropertyHook);
