Template.paymentsDueReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.dueDate = new ReactiveVar();
    Session.set('transactionId','');

    //Subscriptions
    instance.subscribe('unpaidTransactions');
    instance.subscribe('properties');
    instance.subscribe('units');

    //Cursors
    instance.transactions = function() {
        return Transactions.find({balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate.get()}}, {sort: {dueDate: 1}});
    };
});

Template.paymentsDueReport.onRendered(function () {
    var datepicker = $('#datepicker');
    datepicker.datepicker({
        autoclose: true,
        orientation: 'top',
        startDate: "1/1/2000" //stops users from entering '15' and assuming the date saved is 2015
    });

    var today = new Date();
    var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight

    datepicker.datepicker('setUTCDate', todayAdj);
});

Template.paymentsDueReport.events({
    'change #datepicker': function(e) {
        e.preventDefault();
        Template.instance().dueDate.set($('#datepicker').datepicker('getUTCDate'));
    }
});

Template.paymentsDueReport.helpers({
    transactions: function() {
        return Template.instance().transactions();
    }
});