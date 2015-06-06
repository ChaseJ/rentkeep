Template.updatePropertyModal.onCreated(function() {
    var instance = this;
    instance.isMultipleUnits = new ReactiveVar(false);
    instance.unitArray = new ReactiveVar([{id:0,unitNo:''},{id:1,unitNo:''}])

});

Template.updatePropertyModal.onRendered(function() {
    //When modal is closed, reset which tabs will show when opened
    $('#updatePropertyModal').on('hidden.bs.modal', function (e) {
        e.preventDefault();
        $('#propertyTab-update').removeClass('hidden').addClass('show');
        $('#unitTab-update').removeClass('show').addClass('hidden');
    });
});

Template.updatePropertyModal.events({
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
        if (AutoForm.validateForm('updatePropertyForm')) {
            $('#propertyTab-update').removeClass('show').addClass('hidden');
            $('#unitTab-update').removeClass('hidden').addClass('show');
        }
    },
    'change [name=unitNo]' : function (e) {
        e.preventDefault();
        this.unitNo = $(e.target).val();
        var unitArray = Template.instance().unitArray.get();
        unitArray[this.id] = this;
        Template.instance().unitArray.set(unitArray);
    },
    'click .form-add-item': function(e){
        e.preventDefault();
        var unitArray = Template.instance().unitArray.get();
        unitArray.push({id:unitArray.length, unitNo:''});
        Template.instance().unitArray.set(unitArray);
    },
    'click .form-remove-item' : function (e) {
        e.preventDefault();
        var id = this.id;
        var unitArray = Template.instance().unitArray.get();
        unitArray.splice(id, 1);
        for(var i = 0; i < unitArray.length; i++){
            unitArray[i].id = i;
        }
        Template.instance().unitArray.set(unitArray);
    },
    'click #saveBtn': function(e){
        e.preventDefault();

        AutoForm.validateForm('updatePropertyForm');
        var propertyModifier = AutoForm.getFormValues('updatePropertyForm',null,null,true);

        var unitArrayOfObjects = Template.instance().unitArray.get();
        var unitArray = [];
        if (Template.instance().isMultipleUnits.get()) {
            for (var i = 0; i < unitArrayOfObjects.length; i++) {
                unitArray.push(unitArrayOfObjects[i].unitNo);
            }
        }

        Meteor.call('propertyUpdate', Session.get('propertyId'), propertyModifier, unitArray, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                $('#updatePropertyModal').modal('hide');
            }
        });
    }
});

Template.updatePropertyModal.helpers({
    'propertyDoc': function () {
        var propertyId = Session.get('propertyId');
        return propertyId==='' ? false : Properties.findOne(propertyId);
    },
    'isMultipleUnits': function () {
        return Template.instance().isMultipleUnits.get();
    },
    'unitArray': function() {
        return Template.instance().unitArray.get();
    }
});