Template.unitStatusRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Router.go('leaseView', Units.findOne({_id: this._id}));
    }
});