Template.ledgerReport.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('expenseId','');
    Session.set('transactionId','');
    instance.startDate = new ReactiveVar();
    instance.endDate = new ReactiveVar();
    instance.propertyId = new ReactiveVar('all');
    instance.unitId = new ReactiveVar('all');
    instance.expenseTotal = new ReactiveVar(0);
    instance.transactionTotal = new ReactiveVar(0);

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('expenses');
    instance.subscribe('transactions');
    instance.subscribe('leases');

    //Cursors
    instance.properties = function() {
        return Properties.find( {},{ sort: { street: 1 } });
    };
    instance.units = function() {
        return Units.find( { propertyId: instance.propertyId.get() },{ sort: { unitNo: 1 } });
    };
    instance.expenses = function() {
        if (instance.propertyId.get() === 'all' && instance.unitId.get() === 'all' ) {
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
    instance.transactions = function() {
        if (instance.propertyId.get() === 'all' && instance.unitId.get() === 'all' ) {
            return Transactions.find(
                {amtPaid: { $gt: 0 }, paidDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {paidDate: -1}}
            );
        } else if (instance.unitId.get() === 'all' ) {
            return Transactions.find(
                {amtPaid: { $gt: 0 }, propertyId: instance.propertyId.get(), paidDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {paidDate: -1}}
            );
        } else {
            return Transactions.find(
                {amtPaid: { $gt: 0 }, propertyId: instance.propertyId.get(), unitId: instance.unitId.get(), paidDate: {$gte: instance.startDate.get(), $lte: instance.endDate.get()}},
                {sort: {paidDate: -1}}
            );
        }
    };
});

Template.ledgerReport.onRendered(function () {
    $('#datepicker').datepicker({
        autoclose: true,
        orientation: 'top',
        startDate: "1/1/2000" //stops users from entering '15' and assuming the date saved is 2015
    });

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
    'click .export-btn': function(e) {
        e.preventDefault();

        var transactionsArray = Template.instance().transactions().map(function(transaction, index) {
            //Show optional properties if not declared yet
            if(index===0) {
                if(!transaction.hasOwnProperty('notes')) {transaction.notes=''}
                if(!transaction.hasOwnProperty('refNo')) {transaction.refNo=''}
            }
            transaction.streetAndUnit = transaction.streetAndUnit();
            transaction.status = transaction.status();
            transaction.dueDate = moment.utc(transaction.dueDate).format("M/D/YY");
            transaction.paidDate = transaction.hasOwnProperty('paidDate') ? moment.utc(transaction.paidDate).format("M/D/YY") : "";            return _.omit(transaction, ['leaseId', 'propertyId', 'unitId', 'userId', "_id"]);
        });
        var csv = Papa.unparse(transactionsArray);
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
    transactions: function() {
        return Template.instance().transactions();
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
    transactionTotal: function() {
        var sum = 0;
        Template.instance().transactions().forEach(function(transaction){
            sum = sum + transaction.amtPaid;
        });
        Template.instance().transactionTotal.set(sum);
        return sum;
    },
    profitTotal: function() {
        return Template.instance().transactionTotal.get() - Template.instance().expenseTotal.get();
    }
});