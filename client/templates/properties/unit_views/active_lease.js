Template.activeLease.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    var tenantIds = [];
    Session.set('leaseId', '');

    //Subscriptions
    var leaseSubscription = instance.subscribe('activeLeaseByUnit', unitId);

    instance.autorun(function(){
        if(leaseSubscription.ready()){
            var lease = Leases.findOne({unitId: unitId});
            if(lease){
                tenantIds = lease.tenants;
                instance.subscribe('tenantsById', tenantIds);

                Session.set('leaseId', lease._id);
                instance.subscribe('transactionsByLease', Session.get('leaseId'));
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
        return Transactions.find({leaseId: Session.get('leaseId')}, {sort: {dueDate: 1}});
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