Template.removeInvoiceModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();

        Meteor.call('invoiceRemove', Session.get('invoiceId'), function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#removeInvoiceModal').modal('hide');
            }
        });
    }
});