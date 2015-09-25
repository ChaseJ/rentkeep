Template.leaseInvoiceRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('invoiceId',Template.instance().data._id);
    }
});