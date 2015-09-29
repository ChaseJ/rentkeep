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
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateLeaseModal').modal('hide');
    }
});

Template.updateLeaseModal.helpers({
    'leaseDoc': function () {
        var leaseId = Session.get('leaseId');
        return leaseId==='' ? false : Leases.findOne(leaseId);
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

