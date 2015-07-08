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
            } else if (moment(currentLeaseEnds).isBefore(moment().add(1,'months'))){
                return unit;
            }
        });

        return _.compact(unitArray);
    },
    rentPastDue: function() {
        var rentPastDue = 0;
        var today = moment();

        Template.instance().transactions().forEach(function(transaction) {
            //Because moment() is local time, and dueDate is UTC midnight,
            //I have to add the timezone offset to compare days
            var dueDate = moment(transaction.dueDate).subtract(moment().utcOffset(),"m");

            if(today.isAfter(dueDate, 'day') && transaction.balance>0){
                rentPastDue+=transaction.balance;
            }
        });

        return rentPastDue;
    },
    rentMonthPastDue: function() {
        var rentPastDue = 0;
        var monthBeforeToday = moment().subtract(1, 'months');

        Template.instance().transactions().forEach(function(transaction) {
            var dueDate = moment(transaction.dueDate).subtract(moment().utcOffset(),"m");

            if(monthBeforeToday.isAfter(dueDate, 'day')){
                if(transaction.balance>0){
                    rentPastDue = rentPastDue + transaction.balance;
                }
            }
        });

        return rentPastDue;
    },
    vacantUnits: function() {
        var vacantUnits = 0;

        Template.instance().units().forEach(function(unit) {
            if( unit.currentLeaseEnds() === "Vacant") {
                vacantUnits+=1;
            }
        });

        return vacantUnits;
    },
    soonToBeVacantUnits: function() {
        var soonToBeVacantUnits = 0;
        var today = moment();
        var monthFromToday = today.add(1, 'months');

        Template.instance().units().forEach(function(unit) {
            var currentLeaseEnds = moment(unit.currentLeaseEnds()).subtract(moment().utcOffset(),'m');
            var nextLeaseStarts = moment(unit.nextLeaseStarts()).subtract(moment().utcOffset(),'m');

            if(monthFromToday.isAfter(currentLeaseEnds, 'day')) {
                if(!nextLeaseStarts.isValid()) {
                    soonToBeVacantUnits+=1;
                } else if (monthFromToday.isBefore(nextLeaseStarts, 'day')){
                    soonToBeVacantUnits+=1;
                }
            }
        });

        return soonToBeVacantUnits;
    }
});