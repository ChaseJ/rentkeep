Template.homeStatcards.onCreated(function () {
    //Initialization
    var instance = this;

    //Cursors
    instance.invoices = function() {
        return Invoices.find({},{sort: {dueDate: 1}});
    };
    instance.units = function() {
        return Units.find({});
    };
});

Template.homeStatcards.helpers({
    invoicePastDue: function() {
        var invoicePastDue = 0;
        var today = moment();

        Template.instance().invoices().forEach(function(invoice) {
            //Because moment() is local time, and dueDate is UTC midnight,
            //I have to add the timezone offset to compare days
            var dueDate = moment(invoice.dueDate).subtract(moment().utcOffset(),"m");

            if(today.isAfter(dueDate, 'day') && invoice.balance>0){
                invoicePastDue+=invoice.balance;
            }
        });

        return invoicePastDue;
    },
    invoicePastDue30Days: function() {
        var invoicePastDue = 0;
        var dateBeforeToday = moment().subtract(30, 'days');

        Template.instance().invoices().forEach(function(invoice) {
            var dueDate = moment(invoice.dueDate).subtract(moment().utcOffset(),"m");

            if(dateBeforeToday.isAfter(dueDate, 'day')){
                if(invoice.balance>0){
                    invoicePastDue = invoicePastDue + invoice.balance;
                }
            }
        });

        return invoicePastDue;
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
    vacantUnits30days: function() {
        var vacantUnits = 0;
        var today = moment();
        var dateFromToday = today.add(30, 'days');

        Template.instance().units().forEach(function(unit) {
            var vacant = true;
            var leases = Leases.find({unitId: unit._id});

            leases.forEach(function(lease){
                if(lease.startDate <= dateFromToday && lease.endDate >= dateFromToday){
                    vacant = false;
                }
            });

            if(vacant){
                vacantUnits+=1;
            }
        });

        return vacantUnits;
    }
});