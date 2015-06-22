Template.leaseView.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    Session.set('leaseId', '');
    Session.set('transactionId','');
    Session.set('tenantId','');
    instance.tenantIds = new ReactiveVar([]);

    //Subscriptions
    instance.subscribe('leasesByUnit', unitId);
    instance.autorun(function(){
        var lease = Leases.findOne({_id: Session.get('leaseId')});
        if(lease){
            instance.tenantIds.set(lease.tenants);
            instance.subscribe('tenantsById', instance.tenantIds.get());
            instance.subscribe('transactionsByLease', Session.get('leaseId'));
        }
    });

    //Cursors
    instance.leases = function() {
        return Leases.find({unitId: unitId}, {sort: {startDate: -1}});
    };
    instance.lease = function() {
        return Leases.findOne({_id: Session.get('leaseId')});
    };
    instance.tenants = function() {
        return Tenants.find({_id: {$in: instance.tenantIds.get()} });
    };
    instance.transactions = function() {
        return Transactions.find({leaseId: Session.get('leaseId')}, {sort: {dueDate: 1}});
    };

    //Set leaseId if blank
    instance.autorun(function() {
        if(!Session.get('leaseId')){
            var today = new Date();
            today.setUTCHours(0,0,0,0);
            instance.leases().forEach(function(lease, index){
                if(lease.startDate<today && lease.endDate>today){
                    Session.set('leaseId', lease._id);
                } else if (index===0) {
                    Session.set('leaseId', lease._id);
                }
            });
        }
    });

});

Template.leaseView.events({
    'change #lease-select': function(e) {
        e.preventDefault();
        Session.set('leaseId', $('#lease-select').val());
    }
});

Template.leaseView.helpers({
    leases: function() {
        return Template.instance().leases();
    },
    lease : function() {
        return Template.instance().lease();
    },
    tenants : function() {
        return Template.instance().tenants();
    },
    transactions: function() {
        return Template.instance().transactions();
    },
    hasLeases: function() {
        return Template.instance().leases().count()>0;
    },
    selectedLease: function() {
        return Session.get('leaseId');
    }
});