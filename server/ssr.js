//Server side rendering compiling
SSR.compileTemplate('emailLayout', Assets.getText('email_layout.html'));
SSR.compileTemplate('invoiceDueEmail', Assets.getText('invoice_due_email.html'));

//Helpers
Template.invoiceDueEmail.helpers({
    formatDate: function(date){
        return moment.utc(date).format("M/D/YY");
    }
});