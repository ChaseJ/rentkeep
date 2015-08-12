Template.ledgerReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.startDate = new ReactiveVar();
    instance.endDate = new ReactiveVar();
    instance.propertyId = new ReactiveVar('all');
    instance.unitId = new ReactiveVar('all');

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
                {paidDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {paidDate: -1}}
            );
        } else if (instance.unitId.get() === 'all' ) {
            return Transactions.find(
                {propertyId: instance.propertyId.get(), paidDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {paidDate: -1}}
            );
        } else {
            return Transactions.find(
                {propertyId: instance.propertyId.get(), unitId: instance.unitId.get(), paidDate: {$gte: instance.startDate.get(), $lte: instance.endDate.get()}},
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
    var yearAgo = new Date();
    yearAgo = new Date(yearAgo.setDate(yearAgo.getDate()-365));
    var yearAgoAdj = new Date(yearAgo.setHours(0,0,0,0) - (yearAgo.getTimezoneOffset() * 60000)); //UTC midnight

    $('[name=end-date]').datepicker('setUTCDate', todayAdj);
    $('[name=start-date]').datepicker('setUTCDate', yearAgoAdj);
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
    }
});