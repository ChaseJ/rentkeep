Template.tenantRow.events({
    'click tr': function(e) {
        e.preventDefault();
        Session.set('tenantId',Template.instance().data._id);
    }
});