Template.paymentsDueReportPrint.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = Router.current().params.query.propId ? Router.current().params.query.propId : this.data.propId;
    instance.dueDate = Router.current().params.query.date ? new Date(Router.current().params.query.date) : this.data.date;

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('unpaidTransactions');

    //Cursors
    instance.property = function() {
        return Properties.findOne( {_id: instance.propertyId} );
    };
    instance.transactions = function() {
        if (instance.propertyId === 'all') {
            return Transactions.find({balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate}}, {sort: {dueDate: 1}});
        } else {
            return Transactions.find({propertyId: instance.propertyId, balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate}}, {sort: {dueDate: 1}});
        }
    };
});

Template.paymentsDueReportPrint.helpers({
    property: function() {
        return Template.instance().property();
    },
    transactions: function() {
        return Template.instance().transactions();
    },
    date: function() {
        return Template.instance().dueDate;
    }
});