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

Template.insertLeaseModal.events({
    'click #saveBtn': function(e){
        e.preventDefault();

        if(!AutoForm.validateForm('insertLeaseForm')){return;}
        var leaseDoc = AutoForm.getFormValues('insertLeaseForm',null,null,false);

        Meteor.call('leaseInsert', leaseDoc, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#insertLeaseModal').modal('hide');
            }
        })
    }
});

Template.insertLeaseModal.helpers({
    s2Opts: function () {
        var tenantArray = Template.instance().tenants();
        var data=[];
        for(var i = 0; i < tenantArray.length; i++) {
            var dataObject = {
                id: tenantArray[i]._id,
                text: tenantArray[i].firstName + ' ' + tenantArray[i].lastName
            };
            data.push(dataObject);
        }

        return {
            data: data,
            theme: "bootstrap",
            width: "style",
            placeholder: "Search..."
        };
    }
});