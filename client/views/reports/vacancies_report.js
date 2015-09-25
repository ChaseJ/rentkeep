Template.vacanciesReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = new ReactiveVar('all');
    instance.vacanciesDate = new ReactiveVar();

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');

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
    'change #property-select': function(e) {
        e.preventDefault();
        Template.instance().propertyId.set($(e.target).val());
    },
    'change #datepicker': function(e) {
        e.preventDefault();
        Template.instance().vacanciesDate.set($('#datepicker').datepicker('getUTCDate'));
    },
    'click #export-csv': function(e) {
        e.preventDefault();
        var vacanciesArray = _.map(Template.instance().vacancies(), function(unit) {
            var currentLeaseEnds = unit.currentLeaseEnds();
            var nextLeaseStarts = unit.nextLeaseStarts();
            unit.streetAndUnit = unit.streetAndUnit();
            unit.currentLeaseEnds = moment.isDate(currentLeaseEnds) ? moment.utc(currentLeaseEnds).format("M/D/YY") : currentLeaseEnds;
            unit.nextLeaseStarts = moment.isDate(nextLeaseStarts) ? moment.utc(nextLeaseStarts).format("M/D/YY") : nextLeaseStarts;
            return _.omit(unit, ['_id', 'unitNo', 'propertyId', 'userId']);
        });
        var csv = Papa.unparse(vacanciesArray);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "vacancies.csv");
    },
    'click #export-pdf': function(e) {
        e.preventDefault();
        var data = {
            propId: Template.instance().propertyId.get(),
            date: Template.instance().vacanciesDate.get()
        };
        var html = Blaze.toHTMLWithData(Template.vacanciesReportPrint, data);
        html = '<link rel="stylesheet" type="text/css" href="' + window.location.protocol + '//' + window.location.host + '/pdf.css">' + html;
        Meteor.pdf.save(html, 'vacancies', pdfOptions);
    },
    'click .print-btn': function(e) {
        e.preventDefault();
        var dateObj = Template.instance().vacanciesDate.get();
        var query = 'propId='+Template.instance().propertyId.get()+'&date='+dateObj.toISOString();
        window.open(Router.url('vacanciesReportPrint',{},{query: query}),'Vacancies Report','width=600,height=800');
    }
});

Template.vacanciesReport.helpers({
    properties: function() {
        return Template.instance().properties();
    },
    vacancies: function() {
        return Template.instance().vacancies();
    }
});