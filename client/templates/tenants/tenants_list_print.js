Template.tenantsListPrint.onCreated(function () {
    //Initialization
    var instance = this;
    instance.current = Router.current().params.query.current ? (Router.current().params.query.current==='true') : this.data.current;
    instance.past = Router.current().params.query.past ? (Router.current().params.query.past==='true') : this.data.past;
    instance.future = Router.current().params.query.future ? (Router.current().params.query.future==='true') : this.data.future;
    instance.applicants = Router.current().params.query.applicants ? (Router.current().params.query.applicants==='true') : this.data.applicants;
    instance.propertyId = Router.current().params.query.propId ? Router.current().params.query.propId : this.data.propId;
    instance.unitId = Router.current().params.query.unitId ? Router.current().params.query.unitId : this.data.unitId;

    //Subscriptions
    instance.subscribe('tenants');
    instance.subscribe('leases');
    instance.subscribe('units');
    instance.subscribe('properties');

    //Cursors
    instance.tenants = function() {
        var tenantIds = [];
        var tenantIds2 = [];
        var leases;

        if (instance.propertyId === 'all') {
            leases = Leases.find({});
        } else if (instance.unitId === 'all' ) {
            leases = Leases.find({propertyId: instance.propertyId});
        } else {
            leases = Leases.find({unitId: instance.unitId});
        }

        leases.forEach(function(lease){
            if(instance.current && lease.status()==='current'){
                _.each(lease.tenants, function(tenantId){
                    tenantIds.push(tenantId);
                })
            }
            if(instance.past && lease.status()==='past'){
                _.each(lease.tenants, function(tenantId){
                    tenantIds.push(tenantId);
                })
            }
            if(instance.future && lease.status()==='future'){
                _.each(lease.tenants, function(tenantId){
                    tenantIds.push(tenantId);
                })
            }
            if(instance.applicants){
                _.each(lease.tenants, function(tenantId){
                    tenantIds2.push(tenantId);
                })
            }
        });

        if(instance.applicants){
            return Tenants.find({ $or: [ {_id: {$in: tenantIds}}, {_id: {$nin: tenantIds2}}] }, {sort: {lastName: 1}})
        } else {
            return Tenants.find({_id: {$in: tenantIds} }, {sort: {lastName: 1}})
        }
    };
});

Template.tenantsListPrint.helpers({
    tenants: function() {
        return Template.instance().tenants();
    }
});