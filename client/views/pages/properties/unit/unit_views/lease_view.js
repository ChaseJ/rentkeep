Template.leaseView.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;
    Session.set('invoiceId','');
    Session.set('tenantId','');
    instance.tenantIds = new ReactiveVar([]);

    //Subscriptions
    instance.subscribe('leasesByUnit', unitId);
    instance.autorun(function(){
        var lease = Leases.findOne({_id: Session.get('leaseId')});
        if(lease){
            instance.tenantIds.set(lease.tenants);
            instance.subscribe('tenantsById', instance.tenantIds.get());
            instance.subscribe('invoicesByLease', Session.get('leaseId'));
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
    instance.invoices = function() {
        return Invoices.find({leaseId: Session.get('leaseId')}, {sort: {dueDate: 1}});
    };
    instance.documents = function() {
        return Documents.find({leaseId: Session.get('leaseId')});
    };

    //Set leaseId if blank or not associated with the unit
    instance.autorun(function() {
        if(!instance.lease()){
            instance.leases().forEach(function(lease, index){
                if(lease.status()==='current'){
                    Session.set('leaseId', lease._id);
                } else if (index===0) {
                    Session.set('leaseId', lease._id);
                }
            });
        }
    });

});

Template.leaseView.onRendered(function () {
    $('#updateLeaseModal').on('hidden.bs.modal', function () {
        AutoForm.resetForm('updateLeaseForm');
    });
    $('#updateTenantModal').on('hidden.bs.modal', function () {
        AutoForm.resetForm('updateTenantForm');
    });
    $('#updateInvoiceModal').on('hidden.bs.modal', function () {
        AutoForm.resetForm('updateInvoiceForm');
    });
});

Template.leaseView.events({
    'change #lease-select': function(e) {
        e.preventDefault();
        Session.set('leaseId', $('#lease-select').val());
    },
    'click #email-tenants': function(e) {
        e.preventDefault();
        var noEmailArray = [];
        var toString = '';

        Template.instance().tenants().forEach(function(tenant){
            if(tenant.email){
                if(toString === '') {
                    toString = tenant.email;
                } else {
                    toString = toString + ',+' + tenant.email;
                }
            } else {
                noEmailArray.push(tenant.firstName + " " + tenant.lastName);
            }
        });

        if(noEmailArray.length !== 0){
            BootstrapModalPrompt.prompt({
                title: "Email Tenants",
                template: Template.emailTenantsModal,
                templateData: { tenants: noEmailArray }
            }, function(result) {
                if (result) {
                    window.location.href = "mailto:?to=" + toString
                }
            });
        } else {
            window.location.href = "mailto:?to=" + toString
        }
    },
    'click #document-add': function(e, t) {
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
    invoices: function() {
        return Template.instance().invoices();
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