Template.leasesRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('leaseId', this._id);
        Router.go('leaseView', Units.findOne({_id: this.unitId}));
    }
});