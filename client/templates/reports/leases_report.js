Template.leasesReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = new ReactiveVar('all');
    instance.leasesDate = new ReactiveVar();

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');
    instance.subscribe('tenants');

    //Cursors
    instance.properties = function() {
        return Properties.find( {},{ sort: { street: 1 } });
    };
    instance.leases = function() {
        if (instance.propertyId.get() === 'all') {
            return Leases.find({startDate: {$lte: instance.leasesDate.get()}, endDate: {$gte: instance.leasesDate.get()}});
        } else {
            return Leases.find({propertyId: instance.propertyId.get(), startDate: {$lte: instance.leasesDate.get()}, endDate: {$gte: instance.leasesDate.get()}});
        }
    };
});

Template.leasesReport.onRendered(function () {
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

Template.leasesReport.events({
    'change #property-select': function(e) {
        e.preventDefault();
        Template.instance().propertyId.set($(e.target).val());
    },
    'change #datepicker': function(e) {
        e.preventDefault();
        Template.instance().leasesDate.set($('#datepicker').datepicker('getUTCDate'));
    }
});

Template.leasesReport.helpers({
    properties: function() {
        return Template.instance().properties();
    },
    leases: function() {
        return Template.instance().leases();
    }
});