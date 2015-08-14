Template.leasesReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.leasesDate = new ReactiveVar();

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');

    //Cursors
    instance.leases = function() {
        return Leases.find(
            {startDate: {$lte: instance.leasesDate.get()}, endDate: {$gte: instance.leasesDate.get()}});
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
    'change #datepicker': function(e) {
        e.preventDefault();
        Template.instance().leasesDate.set($('#datepicker').datepicker('getUTCDate'));
    }
});

Template.leasesReport.helpers({
    leases: function() {
        return Template.instance().leases();
    }
});