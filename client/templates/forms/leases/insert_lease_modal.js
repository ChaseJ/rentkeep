Template.insertLeaseModal.onCreated(function() {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('tenants');

    //Data
    instance.tenants = function() {
        return Tenants.find({},{sort: {lastName: 1}, fields: {_id: 1, firstName: 1, lastName: 1}}).fetch();
    };

});

Template.insertLeaseModal.helpers({
    selectOptions: function () {
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