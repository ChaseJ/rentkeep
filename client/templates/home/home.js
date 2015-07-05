Template.home.onCreated(function () {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('dueTransactions', 7);
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');

    //Cursors
    instance.transactions = function() {
        return Transactions.find({},{sort: {dueDate: 1}});
    };
});

Template.home.helpers({
    transactions: function() {
        return Template.instance().transactions();
    }
});