Template.accountSettings.onCreated(function () {
    //Initialization
    var instance = this;
    instance.profileFormSuccess = new ReactiveVar(false);
});


Template.accountSettings.helpers({
    profileFormSuccess: function () {
        return Template.instance().profileFormSuccess.get();
    }
});