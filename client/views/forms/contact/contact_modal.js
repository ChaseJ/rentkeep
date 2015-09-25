Template.contactModal.onCreated(function () {
    //Initialization
    var instance = this;
    instance.contactFormSuccess = new ReactiveVar(false);
});

Template.contactModal.helpers({
    contactFormSuccess: function () {
        return Template.instance().contactFormSuccess.get();
    }
});