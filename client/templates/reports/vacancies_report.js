Template.vacanciesReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.vacanciesDate = new ReactiveVar();

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');

    //Cursors
    instance.units = function() {
        return Units.find({});
    };
});

Template.vacanciesReport.onRendered(function () {
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

Template.vacanciesReport.events({
    'change #datepicker': function(e) {
        e.preventDefault();
        Template.instance().vacanciesDate.set($('#datepicker').datepicker('getUTCDate'));
    }
});

Template.vacanciesReport.helpers({
    units: function() {
        var date = Template.instance().vacanciesDate.get();

        var unitArray = Template.instance().units().map(function(unit) {
            var vacant = true;
            var leases = Leases.find({unitId: unit._id});

            leases.forEach(function(lease){
                if(lease.startDate <= date && lease.endDate >= date){
                    vacant = false;
                }
            });

            if(vacant){
                return unit;
            }
        });

        return _.compact(unitArray);
    }
});