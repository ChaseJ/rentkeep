Template.activeLease.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    var tenantIds = [];

    //Subscriptions
    var leaseSubscription = instance.subscribe('activeLeaseByUnit', unitId);

    instance.autorun(function(){
        if(leaseSubscription.ready()){
            var lease = Leases.findOne({unitId: unitId});
            if(lease){
                tenantIds = lease.tenants;
                instance.subscribe('tenantsById', tenantIds);
            }
        }
    });

    //Cursors
    instance.lease = function() {
        return Leases.findOne({unitId: unitId});
    };
    instance.tenants = function() {
        return Tenants.find({_id: {$in: tenantIds} });
    };
});

Template.activeLease.helpers({
    lease : function() {
        return Template.instance().lease();
    },
    tenants : function() {
        return Template.instance().tenants();
    }
});