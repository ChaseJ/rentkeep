Template.ledgerReportPrint.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = Router.current().params.query.propId ? Router.current().params.query.propId : this.data.propId;
    instance.unitId = Router.current().params.query.unitId ? Router.current().params.query.unitId : this.data.unitId;
    instance.startDate = Router.current().params.query.startDate ? new Date(Router.current().params.query.startDate) : this.data.startDate;
    instance.endDate = Router.current().params.query.endDate ? new Date(Router.current().params.query.endDate) : this.data.endDate;
    instance.expenseTotal = new ReactiveVar(0);
    instance.revenueTotal = new ReactiveVar(0);

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('expenses');
    instance.subscribe('invoices');
    instance.subscribe('leases');

    //Cursors
    instance.property = function() {
        return Properties.findOne( {_id: instance.propertyId} );
    };
    instance.unit = function() {
        if (instance.unitId === 'all') {
            return 'Property & All Units';
        } else if (instance.unitId === 'property') {
            return 'Only Property';
        } else {
            var unit = Units.find( { _id: instance.unitId } );
            return unit.unitNo;
        }
    };
    instance.expenses = function() {
        if (instance.propertyId === 'all' && instance.unitId === 'all' ) {
            return Expenses.find(
                {expDate: { $gte: instance.startDate, $lte: instance.endDate }},
                {sort: {expDate: -1}}
            );
        } else if (instance.unitId === 'all' ) {
            return Expenses.find(
                {propertyId: instance.propertyId, expDate: { $gte: instance.startDate, $lte: instance.endDate }},
                {sort: {expDate: -1}}
            );
        } else {
            return Expenses.find(
                {propertyId: instance.propertyId, unitId: instance.unitId, expDate: {$gte: instance.startDate, $lte: instance.endDate}},
                {sort: {expDate: -1}}
            );
        }
    };
    instance.invoices = function() {
        if (instance.propertyId === 'all' && instance.unitId === 'all' ) {
            return Invoices.find(
                {amtPaid: { $gt: 0 }, paidDate: { $gte: instance.startDate, $lte: instance.endDate }},
                {sort: {paidDate: -1}}
            );
        } else if (instance.unitId === 'all' ) {
            return Invoices.find(
                {amtPaid: { $gt: 0 }, propertyId: instance.propertyId, paidDate: { $gte: instance.startDate, $lte: instance.endDate }},
                {sort: {paidDate: -1}}
            );
        } else {
            return Invoices.find(
                {amtPaid: { $gt: 0 }, propertyId: instance.propertyId, unitId: instance.unitId, paidDate: {$gte: instance.startDate, $lte: instance.endDate}},
                {sort: {paidDate: -1}}
            );
        }
    };
});

Template.ledgerReportPrint.helpers({
    property: function () {
        return Template.instance().property();
    },
    unit: function() {
        return Template.instance().unit();
    },
    expenses: function() {
        return Template.instance().expenses();
    },
    invoices: function() {
        return Template.instance().invoices();
    },
    expenseTotal: function() {
        var sum = 0;
        Template.instance().expenses().forEach(function(expense){
            sum = sum + expense.amount;
        });
        Template.instance().expenseTotal.set(sum);
        return sum;
    },
    revenueTotal: function() {
        var sum = 0;
        Template.instance().invoices().forEach(function(invoice){
            sum = sum + invoice.amtPaid;
        });
        Template.instance().revenueTotal.set(sum);
        return sum;
    },
    profitTotal: function() {
        return Template.instance().revenueTotal.get() - Template.instance().expenseTotal.get();
    },
    startDate: function() {
        return Template.instance().startDate;
    },
    endDate: function() {
        return Template.instance().endDate;
    }
});