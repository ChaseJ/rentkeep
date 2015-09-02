Template.tenantRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('tenantId',Template.instance().data._id);
    }
});

Template.tenantRow.helpers({
    leaseDesc: function () {
        return this.streetAndUnit() + ' (' + moment.utc(this.startDate).format("M/D/YY") + '-' + moment.utc(this.endDate).format("M/D/YY") + ')';
    }
});