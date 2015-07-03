Template.transactionRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('transactionId',Template.instance().data._id);
    }
});

Template.transactionRow.helpers({
    status: function() {
        if(this.balance > 0){
            //Because moment() is local time, and dueDate is UTC midnight,
            //I have to add the timezone offset to compare days
            if(moment().isAfter(moment(this.dueDate).add(moment().zone(),"m"), 'day')){
                return 'Late'
            } else {
                return 'Open'
            }
        } else {
            return 'Paid'
        }
    }
});