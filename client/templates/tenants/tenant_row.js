Template.tenantRow.events({
    'click .tenant-update': function(e) {
        e.preventDefault();
        Session.set('tenantId',Template.instance().data._id);
    },
    'click .tenant-remove': function(e) {
        e.preventDefault();
        Session.set('tenantId',Template.instance().data._id);
    }
});