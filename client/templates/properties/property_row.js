Template.propertyRow.events({
    'click tr': function(event) {
        event.preventDefault();
        Router.go('propertyView', this);
    }
});