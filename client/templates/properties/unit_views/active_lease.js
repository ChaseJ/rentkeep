Template.activeLease.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    var tenantIds = [];
    var leaseId;

    //Subscriptions
    var leaseSubscription = instance.subscribe('activeLeaseByUnit', unitId);

    instance.autorun(function(){
        if(leaseSubscription.ready()){
            var lease = Leases.findOne({unitId: unitId});
            if(lease){
                tenantIds = lease.tenants;
                instance.subscribe('tenantsById', tenantIds);

                leaseId = lease._id;
                instance.subscribe('transactionsByLease', leaseId);
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
    instance.transactions = function() {
        return Transactions.find({leaseId: leaseId});
    };
});

Template.activeLease.helpers({
    lease : function() {
        return Template.instance().lease();
    },
    tenants : function() {
        return Template.instance().tenants();
    },
    transactions: function() {
        return Template.instance().transactions();
    }
});