Template.updatePropertyModal.helpers({
    'propertyDoc': function () {
        var propertyId = Session.get('propertyId');
        return propertyId==='' ? false : Properties.findOne(propertyId);
    }
});