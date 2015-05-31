Template.unitRow.events({
    'click tr': function(event) {
        event.preventDefault();
        Router.go('unitView', this);
    }
});