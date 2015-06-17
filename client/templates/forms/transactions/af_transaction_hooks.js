var insertTransactionHook = {
    formToDoc: function(doc) {
        doc.leaseId = Session.get('leaseId');
        return doc;
    }
};

AutoForm.addHooks('insertTransactionForm', insertTransactionHook, true);