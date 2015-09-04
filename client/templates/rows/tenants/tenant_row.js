Template.tenantRow.events({
    'click .rowCheckboxContainer': function(e) {
        $(e.target.firstChild).prop('checked', !$(e.target.firstChild).prop('checked'));
    }
});

Template.tenantRow.helpers({
    leaseDesc: function () {
        return this.streetAndUnit() + ' (' + moment.utc(this.startDate).format("M/D/YY") + '-' + moment.utc(this.endDate).format("M/D/YY") + ')';
    }
});