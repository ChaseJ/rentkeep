var modalHook = {
    onSuccess: function(formType, result) {
        var modalId = this.formId.replace('Form', 'Modal');
        $('#'+ modalId).modal('hide');
    }
};

var insertTransactionHook = {
    formToDoc: function(doc) {
        doc.leaseId = Session.get('leaseId');
        return doc;
    }
};

var insertLeaseHook = {
    onSuccess: function(formType, result) {
        Session.set('leaseId', result);
    },
    formToDoc: function(doc) {
        doc.unitId = Router.current().params._id;
        return doc;
    }
};

var updateProfileHook = {
    onSuccess: function() {
        this.template.parent().profileFormSuccess.set(true);
    },
    onError: function() {
        this.template.parent().profileFormSuccess.set(false);
    }
};

AutoForm.addHooks('updateProfileForm', updateProfileHook);
AutoForm.addHooks('insertTransactionForm', insertTransactionHook);
AutoForm.addHooks('insertLeaseForm', insertLeaseHook);
AutoForm.addHooks(
    [
        'insertTenantForm',
        'updateTenantForm',
        'updateUnitForm',
        'insertTransactionForm',
        'updateTransactionForm',
        'insertLeaseForm',
        'updateLeaseForm'
    ],
    modalHook);