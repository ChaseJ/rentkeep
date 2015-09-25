Template.propertyExpenses.onCreated(function () {
    //Initialization
    var instance = this;
    var propertyId = Router.current().params.propertyId;
    Session.set('expenseId','');
    instance.startDate = new ReactiveVar();
    instance.endDate = new ReactiveVar();
    instance.unitId = new ReactiveVar('all');

    //Subscriptions
    instance.subscribe('expensesByProperty', propertyId);
    instance.subscribe('unitsByProperty', propertyId);

    //Cursors
    instance.units = function() {
        return Units.find( { propertyId: propertyId },{ sort: { unitNo: 1 } });
    };
    instance.expenses = function() {
        if (instance.unitId.get() === 'all') {
            return Expenses.find(
                {expDate: { $gte: instance.startDate.get(), $lte: instance.endDate.get() }},
                {sort: {expDate: 1}}
            );
        } else {
            return Expenses.find(
                {unitId: instance.unitId.get(), expDate: {$gte: instance.startDate.get(), $lte: instance.endDate.get()}},
                {sort: {expDate: 1}}
            );
        }
    }
});

Template.propertyExpenses.onRendered(function () {
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

Template.propertyExpenses.events({
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

Template.propertyExpenses.helpers({
    units: function () {
        return Template.instance().units();
    },
    expenses: function() {
        return Template.instance().expenses();
    },
    isMultiUnit: function() {
        return Template.instance().units().count()>1;
    }
});