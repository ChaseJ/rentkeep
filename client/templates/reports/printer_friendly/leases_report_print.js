Template.leasesReportPrint.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = Router.current().params.query.propId ? Router.current().params.query.propId : this.data.propId;
    instance.leasesDate = Router.current().params.query.date ? new Date(Router.current().params.query.date) : this.data.date;

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');
    instance.subscribe('tenants');

    //Cursors
    instance.property = function() {
        return Properties.findOne( {_id: instance.propertyId} );
    };
    instance.leases = function() {
        if (instance.propertyId === 'all') {
            return Leases.find({startDate: {$lte: instance.leasesDate}, endDate: {$gte: instance.leasesDate}});
        } else {
            return Leases.find({propertyId: instance.propertyId, startDate: {$lte: instance.leasesDate}, endDate: {$gte: instance.leasesDate}});
        }
    };
});

Template.leasesReportPrint.helpers({
    property: function() {
        return Template.instance().property();
    },
    leases: function() {
        return Template.instance().leases();
    },
    date: function() {
        return Template.instance().leasesDate;
    },
    fullName: function () {
        var tenant = Tenants.findOne({_id: this.valueOf()});
        return tenant.firstName + " " + tenant.lastName;
    }
});