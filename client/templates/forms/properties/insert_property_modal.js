Template.insertPropertyModal.onCreated(function() {
    var instance = this;
    instance.isMultiUnit = new ReactiveVar(false);
    instance.unitArray = new ReactiveVar([{id:0,unitNo:''},{id:1,unitNo:''}])

});

Template.insertPropertyModal.onRendered(function() {
    //When modal is closed, reset which tabs will show when opened
    $('#insertPropertyModal').on('hidden.bs.modal', function (e) {
        e.preventDefault();
        $('#propertyTab-insert').removeClass('hidden').addClass('show');
        $('#unitTab-insert').removeClass('show').addClass('hidden');
    });
});

Template.insertPropertyModal.events({
    'change #multiUnitCheckbox': function(e) {
        e.preventDefault();
        if (e.target.checked) {
            Template.instance().isMultiUnit.set(true);
        } else {
            Template.instance().isMultiUnit.set(false);
        }

    },
    'click #nextBtn': function(e){
        e.preventDefault();
        if (AutoForm.validateForm('insertPropertyForm')) {
            $('#propertyTab-insert').removeClass('show').addClass('hidden');
            $('#unitTab-insert').removeClass('hidden').addClass('show');
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

        if(!AutoForm.validateForm('insertPropertyForm')){return;}
        var propertyDoc = AutoForm.getFormValues('insertPropertyForm',null,null,false);

        var unitArrayOfObjects = Template.instance().unitArray.get();
        var unitArray = [];
        if (Template.instance().isMultiUnit.get()) {
            for (var i = 0; i < unitArrayOfObjects.length; i++) {
                unitArray.push(unitArrayOfObjects[i].unitNo);
            }
        }

        Meteor.call('propertyInsert', propertyDoc, unitArray, function(error) {
            if (error) {
                return alert(error.reason);
            } else {
                var propModal = $('#insertPropertyModal');
                propModal.modal('hide');
                if (Router.current().route.getName() === 'home') {
                    propModal.on('hidden.bs.modal', function () {
                        Router.go('propertiesList');
                    })
                }
            }
        });
    }
});

Template.insertPropertyModal.helpers({
    'isMultiUnit': function () {
        return Template.instance().isMultiUnit.get();
    },
    'unitArray': function() {
        return Template.instance().unitArray.get();
    }
});