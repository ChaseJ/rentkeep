var modalHook = {
    onSuccess: function(formType, result) {
        var modalId = this.formId.replace('Form', 'Modal');
        $('#'+ modalId).modal('hide');
    }
};

var insertExpenseHook = {
    formToDoc: function(doc) {
        if(!doc.unitId) {
            doc.unitId = 'property';
        }
        doc.propertyId = Router.current().params.propertyId;
        return doc;
    }
};

var insertInvoiceHook = {
    formToDoc: function(doc) {
        doc.leaseId = Session.get('leaseId');
        doc.propertyId = Router.current().params.propertyId;
        doc.unitId = Router.current().params._id;
        return doc;
    }
};

var insertLeaseHook = {
    onSuccess: function(formType, result) {
        Session.set('leaseId', result);
    },
    formToDoc: function(doc) {
        doc.propertyId = Router.current().params.propertyId;
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

var contactHook = {
    onSuccess: function() {
        this.template.parent().contactFormSuccess.set(true);
    },
    onError: function() {
        this.template.parent().contactFormSuccess.set(false);
    }
};

AutoForm.addHooks('contactForm', contactHook);
AutoForm.addHooks('updateProfileForm', updateProfileHook);
AutoForm.addHooks('insertInvoiceForm', insertInvoiceHook);
AutoForm.addHooks('insertLeaseForm', insertLeaseHook);
AutoForm.addHooks('insertExpenseForm', insertExpenseHook);
AutoForm.addHooks(
    [
        'insertTenantForm',
        'updateTenantForm',
        'updateUnitForm',
        'insertInvoiceForm',
        'updateInvoiceForm',
        'insertLeaseForm',
        'updateLeaseForm',
        'insertExpenseForm',
        'updateExpenseForm'
    ],
    modalHook);