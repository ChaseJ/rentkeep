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
    datepicker.datepicker(dpOptions);

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
    },
    'click #export-csv': function(e) {
        e.preventDefault();
        var leasesArray = Template.instance().leases().map(function(lease) {
            lease.streetAndUnit = lease.streetAndUnit();
            lease.startDate = moment.utc(lease.startDate).format("M/D/YY");
            lease.endDate = moment.utc(lease.endDate).format("M/D/YY");
            lease.tenants = _.map(lease.tenants, function(tenantId){
                var tenant = Tenants.findOne({_id: tenantId});
                return tenant.firstName + " " + tenant.lastName;
            });
            return _.omit(lease, ['propertyId', 'unitId', 'userId', "_id"]);
        });
        var csv = Papa.unparse(leasesArray);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "leases.csv");
    },
    'click #export-pdf': function(e) {
        e.preventDefault();
        var data = {
            propId: Template.instance().propertyId.get(),
            date: Template.instance().leasesDate.get()
        };
        var html = Blaze.toHTMLWithData(Template.leasesReportPrint, data);
        html = '<link rel="stylesheet" type="text/css" href="' + window.location.protocol + '//' + window.location.host + '/pdf.css">' + html;
        Meteor.pdf.save(html, 'leases', pdfOptions);
    },
    'click .print-btn': function(e) {
        e.preventDefault();
        var dateObj = Template.instance().leasesDate.get();
        var query = 'propId='+Template.instance().propertyId.get()+'&date='+dateObj.toISOString();
        window.open(Router.url('leasesReportPrint',{},{query: query}),'Leases Report','width=600,height=800');
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