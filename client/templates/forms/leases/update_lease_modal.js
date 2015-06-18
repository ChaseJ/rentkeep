Template.updateLeaseModal.onCreated(function() {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('tenants');

    //Data
    instance.tenants = function() {
        return Tenants.find({},{sort: {lastName: 1}, fields: {_id: 1, firstName: 1, lastName: 1}}).fetch();
    };

});

Template.updateLeaseModal.events({
    'click #saveBtn': function(e){
        e.preventDefault();

        if(!AutoForm.validateForm('updateLeaseForm')){return;}
        var leaseModifier = AutoForm.getFormValues('updateLeaseForm',null,null,true);

        Meteor.call('leaseUpdate', Session.get('leaseId'), leaseModifier, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#updateLeaseModal').modal('hide');
            }
        });
    },
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateTransactionModal').modal('hide');
    }
});

Template.updateLeaseModal.helpers({
    'leaseDoc': function () {
        var leaseId = Session.get('leaseId');
        return leaseId==='' ? false : Leases.findOne(leaseId);
    },
    s2Opts: function () {
        return {
            theme: "bootstrap",
            width: "style",
            placeholder: "Search..."
        };
    },
    selectOptions: function() {
        var tenantArray = Template.instance().tenants();
        var data=[];
        for(var i = 0; i < tenantArray.length; i++) {
            var dataObject = {
                value: tenantArray[i]._id,
                label: tenantArray[i].firstName + ' ' + tenantArray[i].lastName
            };
            data.push(dataObject);
        }
        return data;
    }
});

