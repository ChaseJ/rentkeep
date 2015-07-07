Template.home.onCreated(function () {
    //Initialization
    var instance = this;

    //Subscriptions
    instance.subscribe('dueTransactions', 7);
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');

    //Cursors
    instance.transactions = function() {
        return Transactions.find({},{sort: {dueDate: 1}});
    };
    instance.units = function() {
        return Units.find({});
    };
});

Template.home.helpers({
    transactions: function() {
        return Template.instance().transactions();
    },
    units: function() {
        //If unit is vacant or if lease ends in next 30 days, return unit
        var unitArray = Template.instance().units().map(function(unit) {
            var currentLeaseEnds = unit.currentLeaseEnds();
            if( currentLeaseEnds === "Vacant") {
                return unit;
            } else if (moment(currentLeaseEnds).isBefore(moment().add(30,'d'))){
                return unit;
            }
        });
        unitArray = _.compact(unitArray);
        return unitArray;
    }
});