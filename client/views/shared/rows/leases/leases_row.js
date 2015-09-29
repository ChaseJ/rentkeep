Template.leasesRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('leaseId', this._id);
        Router.go('leaseView', Units.findOne({_id: this.unitId}));
    }
});

Template.leasesRow.helpers({
    fullName: function () {
        var tenant = Tenants.findOne({_id: this.valueOf()});
        return tenant.firstName + " " + tenant.lastName;
    }
});
