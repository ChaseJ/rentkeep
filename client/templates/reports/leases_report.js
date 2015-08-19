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
    },
    'click .export-btn': function(e) {
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