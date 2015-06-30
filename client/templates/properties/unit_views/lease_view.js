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
            instance.subscribe('documentsByLease', Session.get('leaseId'));
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
    instance.documents = function() {
        return Documents.find({leaseId: Session.get('leaseId')});
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

Template.leaseView.onRendered(function () {
    $('#updateLeaseModal').on('show.bs.modal', function () {
        AutoForm.resetForm('updateLeaseForm');
    });
    $('#updateTenantModal').on('show.bs.modal', function () {
        AutoForm.resetForm('updateTenantForm');
    });
    $('#updateTransactionModal').on('show.bs.modal', function () {
        AutoForm.resetForm('updateTransactionForm');
    });
});

Template.leaseView.events({
    'change #lease-select': function(e) {
        e.preventDefault();
        Session.set('leaseId', $('#lease-select').val());
    },
    'click .document-select': function(e, t) {
        return t.$('.document-input').click();
    },
    'change .document-input': FS.EventHandlers.insertFiles(Documents, {
        metadata: function (fileObj) {
            return {
                userId: Meteor.userId(),
                leaseId: Session.get('leaseId')
            };
        }
    })
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
    documents: function() {
        return Template.instance().documents();
    },
    hasLeases: function() {
        return Template.instance().leases().count()>0;
    },
    selectedLease: function() {
        return Session.get('leaseId');
    }
});