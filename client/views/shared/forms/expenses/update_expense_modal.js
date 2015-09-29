Template.updateExpenseModal.onCreated(function() {
    //Initialization
    var instance = this;

    //Data
    instance.units = function() {
        var propertyId = Expenses.findOne(Session.get('expenseId')).propertyId;
        return Units.find({propertyId: propertyId},{sort: {unitNo: 1}});
    };

});

Template.updateExpenseModal.events({
    'click #deleteBtn': function(e){
        e.preventDefault();
        $('#updateExpenseModal').modal('hide');
    }
});

Template.updateExpenseModal.helpers({
    unitOptions: function () {
        var unitOptions = [{label: 'Property', value: 'property'}];
        Template.instance().units().forEach(function(unit) {
            unitOptions.push({
                label: 'Unit ' + unit.unitNo,
                value: unit._id
            })
        });
        return unitOptions;
    },
    'expenseDoc': function () {
        var expenseId = Session.get('expenseId');
        return expenseId==='' ? false : Expenses.findOne(expenseId);
    },
    isMultiUnit: function() {
        return Template.instance().units().count()>1;
    }
});