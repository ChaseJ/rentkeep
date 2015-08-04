Template.expenseRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('expenseId',Template.instance().data._id);
    }
});