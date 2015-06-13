Template.activeLease.onCreated(function () {
    //Initialization
    var instance = this;
    var unitId = Router.current().params._id;

    //Subscriptions
    instance.subscribe('activeLeaseByUnit', unitId);

    //Data
    instance.activeLease = function() {
        return Leases.findOne(unitId);
    };
});

Template.activeLease.helpers({
    hasActiveLease: function() {
        return false;
    }
});