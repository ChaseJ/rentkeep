Template.transactionRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('transactionId',Template.instance().data._id);
    }
});

Template.transactionRow.helpers({
    status: function() {
        var amtRemaining = this.amtDue - this.amtPaid;
        if(amtRemaining > 0){
            if(moment.utc().isAfter(moment.utc(this.dueDate), 'day')){
                return 'Late'
            } else {
                return 'Open'
            }
        } else {
            return 'Paid'
        }
    }
});