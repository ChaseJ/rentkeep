Template.homeVacancies.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = new ReactiveVar('all');
    instance.vacanciesDate = new ReactiveVar();

    //Cursors & Arrays
    instance.properties = function() {
        return Properties.find( {},{ sort: { street: 1 } });
    };
    instance.units = function() {
        if (instance.propertyId.get() === 'all') {
            return Units.find({});
        } else {
            return Units.find({propertyId: instance.propertyId.get()});
        }
    };
    instance.vacancies = function() {
        var date = instance.vacanciesDate.get();

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
    };
});

Template.homeVacancies.onRendered(function () {
    var dpVacancies = $('#datepicker-vacancies');
    dpVacancies.datepicker(dpOptions);

    var today = new Date();
    var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight

    dpVacancies.datepicker('setUTCDate', todayAdj);
});

Template.homeVacancies.events({
    'change #property-select-vacancies': function(e) {
        e.preventDefault();
        Template.instance().propertyId.set($(e.target).val());
    },
    'change #datepicker-vacancies': function(e) {
        e.preventDefault();
        Template.instance().vacanciesDate.set($('#datepicker-vacancies').datepicker('getUTCDate'));
    }
});

Template.homeVacancies.helpers({
    properties: function() {
        return Template.instance().properties();
    },
    vacancies: function() {
        return Template.instance().vacancies();
    }
});