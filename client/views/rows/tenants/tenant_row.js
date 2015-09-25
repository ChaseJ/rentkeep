Template.tenantRow.events({
    'click .rowCheckboxContainer': function(e) {
        $(e.target.firstChild).prop('checked', !$(e.target.firstChild).prop('checked'));
    },
    'click .tenant-update': function(e) {
        e.preventDefault();
        Session.set('tenantId',Template.instance().data._id);
    },
    'click .tenant-lease>a': function(e) {
        e.preventDefault();
        Session.set('leaseId', this._id);
        Router.go('leaseView', Units.findOne({_id: this.unitId}));
    },
    'click .tenant-email>a': function(e) {
        e.preventDefault();
        window.location.href = "mailto:?to=" + this.email;
    }
});