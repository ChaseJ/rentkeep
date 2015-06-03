var insertPropertyHook = {
    onSuccess: function(formType, result) {
        $('#addPropertyModal').modal('hide');
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
