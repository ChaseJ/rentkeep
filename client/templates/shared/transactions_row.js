Template.transactionsRow.helpers({
    status: function() {
        var today = new Date();
        var amtRemaining = this.amtDue - this.amtPaid;
        if(amtRemaining > 0){
            if(today>this.dueDate){
                return 'Late'
            } else {
                return 'Open'
            }
        } else {
            return 'Paid'
        }
    }
});