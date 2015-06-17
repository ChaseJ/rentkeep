Template.insertTransactionModal.events({
    'click #saveBtn': function(e){
        e.preventDefault();

        if(!AutoForm.validateForm('insertTransactionForm')){return;}
        var transDoc = AutoForm.getFormValues('insertTransactionForm',null,null,false);

        Meteor.call('transactionInsert', transDoc, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#insertTransactionModal').modal('hide');
            }
        });
    }
});