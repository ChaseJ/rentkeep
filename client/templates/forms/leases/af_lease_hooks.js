var insertLeaseHook = {
    formToDoc: function(doc) {
        doc.unitId = Router.current().params._id;
        return doc;
    }
};

AutoForm.addHooks('insertLeaseForm', insertLeaseHook, true);