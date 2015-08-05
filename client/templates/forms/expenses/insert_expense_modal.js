Template.insertExpenseModal.onCreated(function() {
    //Initialization
    var instance = this;
    var propertyId = Router.current().params.propertyId;

    //Subscriptions
    instance.subscribe('unitsByProperty', propertyId);

    //Data
    instance.units = function() {
        return Units.find({propertyId: propertyId},{sort: {unitNo: 1}});
    };

});

Template.insertExpenseModal.helpers({
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
    defaultUnit: function() {
        return Router.current().params._id;
    },
    isMultiUnit: function() {
        return Template.instance().units().count()>1;
    }
});