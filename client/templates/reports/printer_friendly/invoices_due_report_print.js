Template.invoicesDueReportPrint.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = Router.current().params.query.propId ? Router.current().params.query.propId : this.data.propId;
    instance.dueDate = Router.current().params.query.date ? new Date(Router.current().params.query.date) : this.data.date;

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('unpaidInvoices');

    //Cursors
    instance.property = function() {
        return Properties.findOne( {_id: instance.propertyId} );
    };
    instance.invoices = function() {
        if (instance.propertyId === 'all') {
            return Invoices.find({balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate}}, {sort: {dueDate: 1}});
        } else {
            return Invoices.find({propertyId: instance.propertyId, balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate}}, {sort: {dueDate: 1}});
        }
    };
});

Template.invoicesDueReportPrint.helpers({
    property: function() {
        return Template.instance().property();
    },
    invoices: function() {
        return Template.instance().invoices();
    },
    date: function() {
        return Template.instance().dueDate;
    }
});