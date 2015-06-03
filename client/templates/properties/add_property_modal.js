Template.addPropertyModal.onCreated(function() {
    //Initialization
    var instance = this;
    instance.isMultipleUnits = new ReactiveVar(false);

});

Template.addPropertyModal.events({
    'change #multipleUnitsCheckbox': function(e) {
        e.preventDefault();
        if (e.target.checked) {
            Template.instance().isMultipleUnits.set(true);
        } else {
            Template.instance().isMultipleUnits.set(false);
        }

    }
});

Template.addPropertyModal.helpers({
    'isMultipleUnits': function () {
        return Template.instance().isMultipleUnits.get();
    }
});