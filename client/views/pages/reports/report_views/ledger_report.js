Template.ledgerReport.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('expenseId','');
    Session.set('invoiceId','');
    instance.startDate = new ReactiveVar();
    instance.endDate = new ReactiveVar();
    instance.propertyId = new ReactiveVar('all');
    instance.unitId = new ReactiveVar('all');
    instance.expenseTotal = new ReactiveVar(0);
    instance.revenueTotal = new ReactiveVar(0);

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('expenses');
    instance.subscribe('invoices');
    instance.subscribe('leases');

    //Cursors
    instance.properties = function() {
        return Properties.find( {},{ sort: { street: 1 } });
    };
    instance.units = function() {
        return Units.find( { propertyId: instance.propertyId.get() },{ sort: { unitNo: 1 } });
    };
    instance.expenses = function() {
        if (instance.propertyId.get() === 'all') {
            return Expenses.find(
                {expDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {expDate: -1}}
            );
        } else if (instance.unitId.get() === 'all' ) {
            return Expenses.find(
                {propertyId: instance.propertyId.get(), expDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {expDate: -1}}
            );
        } else {
            return Expenses.find(
                {propertyId: instance.propertyId.get(), unitId: instance.unitId.get(), expDate: {$gte: instance.startDate.get(), $lte: instance.endDate.get()}},
                {sort: {expDate: -1}}
            );
        }
    };
    instance.invoices = function() {
        if (instance.propertyId.get() === 'all') {
            return Invoices.find(
                {amtPaid: { $gt: 0 }, paidDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {paidDate: -1}}
            );
        } else if (instance.unitId.get() === 'all' ) {
            return Invoices.find(
                {amtPaid: { $gt: 0 }, propertyId: instance.propertyId.get(), paidDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {paidDate: -1}}
            );
        } else {
            return Invoices.find(
                {amtPaid: { $gt: 0 }, propertyId: instance.propertyId.get(), unitId: instance.unitId.get(), paidDate: {$gte: instance.startDate.get(), $lte: instance.endDate.get()}},
                {sort: {paidDate: -1}}
            );
        }
    };
});

Template.ledgerReport.onRendered(function () {
    $('#datepicker').datepicker(dpOptions);

    var today = new Date();
    var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight
    var monthAgo = new Date();
    monthAgo = new Date(monthAgo.setDate(monthAgo.getDate()-30));
    var monthAgoAdj = new Date(monthAgo.setHours(0,0,0,0) - (monthAgo.getTimezoneOffset() * 60000)); //UTC midnight

    $('[name=end-date]').datepicker('setUTCDate', todayAdj);
    $('[name=start-date]').datepicker('setUTCDate', monthAgoAdj);
});

Template.ledgerReport.events({
    'change #property-select': function(e) {
        e.preventDefault();
        Template.instance().propertyId.set($(e.target).val());
        $("#unit-select").val('all');
        Template.instance().unitId.set('all');
    },
    'change #unit-select': function(e) {
        e.preventDefault();
        Template.instance().unitId.set($(e.target).val());
    },
    'change [name=start-date]': function(e) {
        e.preventDefault();
        Template.instance().startDate.set($('[name=start-date]').datepicker('getUTCDate'));
    },
    'change [name=end-date]': function(e) {
        e.preventDefault();
        Template.instance().endDate.set($('[name=end-date]').datepicker('getUTCDate'));
    },
    'click #export-csv': function(e) {
        e.preventDefault();

        var invoicesArray = Template.instance().invoices().map(function(invoice, index) {
            //Show optional properties if not declared yet
            if(index===0) {
                if(!invoice.hasOwnProperty('notes')) {invoice.notes=''}
                if(!invoice.hasOwnProperty('refNo')) {invoice.refNo=''}
            }
            invoice.streetAndUnit = invoice.streetAndUnit();
            invoice.status = invoice.status();
            invoice.dueDate = moment.utc(invoice.dueDate).format("M/D/YY");
            invoice.paidDate = invoice.hasOwnProperty('paidDate') ? moment.utc(invoice.paidDate).format("M/D/YY") : "";            return _.omit(invoice, ['leaseId', 'propertyId', 'unitId', 'userId', "_id"]);
        });
        var csv = Papa.unparse(invoicesArray);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "paymentsReceived.csv");

        var expensesArray = Template.instance().expenses().map(function(expense, index) {
            //Show optional properties if not declared yet
            if(index===0) {
                if(!expense.hasOwnProperty('payee')) {expense.payee=''}
                if(!expense.hasOwnProperty('notes')) {expense.notes=''}
            }
            expense.streetAndUnit = expense.streetAndUnit();
            expense.expDate = moment.utc(expense.expDate).format("M/D/YY");
            return _.omit(expense, ['unitNo', 'propertyId', 'unitId', 'userId', "_id"]);
        });
        csv = Papa.unparse(expensesArray);
        blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "expenses.csv");
    },
    'click #export-pdf': function(e) {
        e.preventDefault();
        var data = {
            propId: Template.instance().propertyId.get(),
            unitId: Template.instance().unitId.get(),
            startDate: Template.instance().startDate.get(),
            endDate: Template.instance().endDate.get()
        };
        var html = Blaze.toHTMLWithData(Template.ledgerReportPrint, data);
        html = '<link rel="stylesheet" type="text/css" href="' + window.location.protocol + '//' + window.location.host + '/pdf.css">' + html;
        Meteor.pdf.save(html, 'ledger', pdfOptions);
    },
    'click #print-btn': function(e) {
        e.preventDefault();
        var startDateObj = Template.instance().startDate.get();
        var endDateObj = Template.instance().endDate.get();
        var query = 'propId='+Template.instance().propertyId.get()+'&unitId='+Template.instance().unitId.get()+'&startDate='+startDateObj.toISOString()+'&endDate='+endDateObj.toISOString();
        window.open(Router.url('ledgerReportPrint',{},{query: query}),'Ledger Report','width=800,height=800');
    }
});

Template.ledgerReport.helpers({
    properties: function () {
        return Template.instance().properties();
    },
    units: function() {
        return Template.instance().units();
    },
    expenses: function() {
        return Template.instance().expenses();
    },
    invoices: function() {
        return Template.instance().invoices();
    },
    disablePropertySelect: function() {
        if (Template.instance().propertyId.get()==='all' || Template.instance().units().count()===1) {
            return "disabled";
        }
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
    }
});