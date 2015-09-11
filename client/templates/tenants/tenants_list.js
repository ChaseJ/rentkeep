Template.tenantsList.onCreated(function () {
    //Initialization
    var instance = this;
    Session.set('tenantId','');
    instance.current = new ReactiveVar(true);
    instance.past = new ReactiveVar(false);
    instance.future = new ReactiveVar(false);
    instance.applicants = new ReactiveVar(false);
    instance.propertyId = new ReactiveVar('all');
    instance.unitId = new ReactiveVar('all');
    instance.emailFail = new ReactiveVar(false);

    //Subscriptions
    instance.subscribe('tenants');
    instance.subscribe('leases');
    instance.subscribe('units');
    instance.subscribe('properties');

    //Cursors
    instance.properties = function() {
        return Properties.find( {},{ sort: { street: 1 } });
    };
    instance.units = function() {
        return Units.find( { propertyId: instance.propertyId.get() },{ sort: { unitNo: 1 } });
    };
    instance.tenants = function() {
        var tenantIds = [];
        var tenantIds2 = [];
        var leases;

        if (instance.propertyId.get() === 'all') {
            leases = Leases.find({});
        } else if (instance.unitId.get() === 'all' ) {
            leases = Leases.find({propertyId: instance.propertyId.get()});
        } else {
            leases = Leases.find({unitId: instance.unitId.get()});
        }

        leases.forEach(function(lease){
            if(instance.current.get() && lease.status()==='current'){
                _.each(lease.tenants, function(tenantId){
                    tenantIds.push(tenantId);
                })
            }
            if(instance.past.get() && lease.status()==='past'){
                _.each(lease.tenants, function(tenantId){
                    tenantIds.push(tenantId);
                })
            }
            if(instance.future.get() && lease.status()==='future'){
                _.each(lease.tenants, function(tenantId){
                    tenantIds.push(tenantId);
                })
            }
            if(instance.applicants.get()){
                _.each(lease.tenants, function(tenantId){
                    tenantIds2.push(tenantId);
                })
            }
        });

        if(instance.applicants.get()){
            return Tenants.find({ $or: [ {_id: {$in: tenantIds}}, {_id: {$nin: tenantIds2}}] }, {sort: {lastName: 1}})
        } else {
            return Tenants.find({_id: {$in: tenantIds} }, {sort: {lastName: 1}})
        }
    };
});

Template.tenantsList.onRendered(function () {
    $('#updateTenantModal').on('hidden.bs.modal', function () {
        AutoForm.resetForm('updateTenantForm');
    });
});

Template.tenantsList.events({
    'click #export-csv': function(e) {
        e.preventDefault();
        var tenantsArray = Template.instance().tenants().map(function(tenant, index) {
            //Show optional properties if not declared yet
            if(index===0) {
                if(!tenant.hasOwnProperty('phone')) {transaction.phone=''}
                if(!tenant.hasOwnProperty('email')) {tenant.email=''}
                if(!tenant.hasOwnProperty('notes')) {tenant.notes=''}
            }
            tenant.leases = _.map(tenant.leases(), function(lease){
                return lease.desc();
            });
            return _.omit(tenant, ['userId', "_id"]);
        });
        var csv = Papa.unparse(tenantsArray);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "tenants.csv");
    },
    'click #export-pdf': function(e) {
        e.preventDefault();
        var data = {
            propId: Template.instance().propertyId.get(),
            unitId: Template.instance().unitId.get(),
            current: Template.instance().current.get(),
            past: Template.instance().past.get(),
            future: Template.instance().future.get(),
            applicants: Template.instance().applicants.get()
        };
        var html = Blaze.toHTMLWithData(Template.tenantsListPrint, data);
        html = '<link rel="stylesheet" type="text/css" href="' + window.location.protocol + '//' + window.location.host + '/pdf.css">' + html;
        Meteor.pdf.save(html, 'tenants', pdfOptions);
    },
    'click .print-btn': function(e) {
        e.preventDefault();
        var query = 'propId='+Template.instance().propertyId.get()+'&unitId='+Template.instance().unitId.get()+
            '&current='+Template.instance().current.get()+'&past='+Template.instance().past.get()+
            '&future='+Template.instance().future.get()+'&applicants='+Template.instance().applicants.get();
        window.open(Router.url('tenantsListPrint',{},{query: query}),'Tenants Report','width=800,height=800');
    },
    'change #property-select': function(e) {
        e.preventDefault();
        Template.instance().propertyId.set($(e.target).val());
        Template.instance().unitId.set('all');
    },
    'change #unit-select': function(e) {
        e.preventDefault();
        Template.instance().unitId.set($(e.target).val());
    },
    'change #checkAllCheckbox': function(e) {
        $('.rowCheckbox').prop('checked', $(e.target).prop('checked'))
    },
    'click #checkAllCheckboxContainer': function(e) {
        $(e.target.firstChild).prop('checked', !$(e.target.firstChild).prop('checked'));
        $('.rowCheckbox').prop('checked', $(e.target.firstChild).prop('checked'))
    },
    'click .email-btn': function(e) {
        e.preventDefault();
        var addresses = [];
        var noEmailArray = [];
        var bccString;

        $('.rowCheckbox:checked').each(function() {
            var tenant = Tenants.findOne({_id: this.value});
            if (tenant.email) {
                addresses.push(tenant.email);
            } else {
                noEmailArray.push(tenant.firstName + " " + tenant.lastName);
            }
        });

        _.each(addresses, function(address, index) {
            if(index === 0){
                bccString = address;
            } else {
                bccString = bccString + ",+" + address
            }
        });

        if(bccString){
            Template.instance().emailFail.set(false);
            if(noEmailArray.length !== 0){
                BootstrapModalPrompt.prompt({
                    title: "Email Tenants",
                    template: Template.emailTenantsModal,
                    templateData: { tenants: noEmailArray }
                }, function(result) {
                    if (result) {
                        window.location.href = "mailto:?bcc=" + bccString
                    }
                });
            } else {
                window.location.href = "mailto:?bcc=" + bccString
            }
        } else {
            Template.instance().emailFail.set(true);
        }

    },
    'change #currentCheckbox': function (e) {
        e.preventDefault();
        Template.instance().current.set(e.target.checked);
    },
    'change #pastCheckbox': function (e) {
        e.preventDefault();
        Template.instance().past.set(e.target.checked);
    },
    'change #futureCheckbox': function (e) {
        e.preventDefault();
        Template.instance().future.set(e.target.checked);
    },
    'change #applicantsCheckbox': function (e) {
        e.preventDefault();
        Template.instance().applicants.set(e.target.checked);
    }
});

Template.tenantsList.helpers({
    properties: function () {
        return Template.instance().properties();
    },
    units: function() {
        return Template.instance().units();
    },
    disablePropertySelect: function() {
        if (Template.instance().propertyId.get()==='all' || Template.instance().units().count()===1) {
            return "disabled";
        }
    },
    tenants: function () {
        return Template.instance().tenants();
    },
    currentChecked: function() {
        return Template.instance().current.get();
    },
    pastChecked: function() {
        return Template.instance().past.get();
    },
    futureChecked: function() {
        return Template.instance().future.get();
    },
    applicantsChecked: function() {
        return Template.instance().applicants.get();
    },
    emailFail: function() {
        return Template.instance().emailFail.get();
    }
});