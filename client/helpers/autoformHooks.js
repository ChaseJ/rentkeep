var insertPropertyHook = {
    onSuccess: function(formType, result) {
        //Once modal is done fading out, go to property
        $('#afModal').on('hidden.bs.modal', function () {
            Router.go('propertyView', {_id: result});
        })
    }
};

var insertUnitHook = {
    before: {
        insert: function(doc) {
            doc.propertyId = Router.current().params._id;
            return doc;
        }
    }
};

AutoForm.addHooks('insertPropertyForm', insertPropertyHook);
AutoForm.addHooks('insertUnitForm', insertUnitHook);
