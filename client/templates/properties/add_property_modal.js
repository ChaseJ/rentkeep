Template.addPropertyModal.onCreated(function() {
    //Initialization
    var instance = this;
    instance.isMultipleUnits = new ReactiveVar(false);

});

Template.addPropertyModal.onRendered(function() {
    //When modal is closed, reset which tabs will show when opened
    $('#addPropertyModal').on('hidden.bs.modal', function (e) {
        e.preventDefault();
        console.log("Hidden ran");
        $('#propertyTab').removeClass('hidden').addClass('show');
        $('#unitTab').removeClass('show').addClass('hidden');
    });
});

Template.addPropertyModal.events({
    'change #multipleUnitsCheckbox': function(e) {
        e.preventDefault();
        if (e.target.checked) {
            Template.instance().isMultipleUnits.set(true);
        } else {
            Template.instance().isMultipleUnits.set(false);
        }

    },
    'click #nextBtn': function(e){
        e.preventDefault();
        if (AutoForm.validateForm('insertPropertyForm')) {
            $('#propertyTab').removeClass('show').addClass('hidden');
            $('#unitTab').removeClass('hidden').addClass('show');
        }
    }

});

Template.addPropertyModal.helpers({
    'isMultipleUnits': function () {
        return Template.instance().isMultipleUnits.get();
    }
});