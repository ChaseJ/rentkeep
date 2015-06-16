Leases = new Mongo.Collection("leases");

Leases.attachSchema(new SimpleSchema({
    unitId: {
        type: String
    },
    'userId': {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    'rentAmt' : {
        type: Number,
        label: 'Rent',
        decimal: true
    },
    'depositAmt' : {
        type: Number,
        label: 'Deposit',
        decimal: true,
        optional: true
    },
    'startDate' : {
        type: Date,
        label: 'Start Date'
    },
    'endDate' : {
        type: Date,
        label: 'End Date',
        custom: function() {
            if(this.value <= this.field('startDate').value){
                return 'endDateBeforeStart'
            }
        }
    },
    tenants: {
        type: [String],
        label: 'Tenants'
    }
}));

SimpleSchema.messages({
   'endDateBeforeStart' : 'End date must be after start date.'
});

Meteor.methods({
    leaseInsert: function(leaseDoc){
        check(this.userId, String);
        var leaseId = Leases.insert(leaseDoc);

        //Create transactions for bills
        var user = Meteor.user();
        var transDoc = {
            leaseId: leaseId,
            userId: user._id,
            amtPaid: 0,
            notes: ''
        };

        //Add deposit bill if necessary
        if(leaseDoc.depositAmt !== 0){
            var depositDoc = _.extend(transDoc, {
                dueDate: leaseDoc.startDate,
                desc: 'Deposit',
                amtDue: leaseDoc.depositAmt
            });
            console.log("Deposit Doc:");
            console.log(depositDoc);
            Transactions.insert(depositDoc);
        }

        //Add first month rent, prorate if necessary
        //var firstPayment = _.extend(transDco, {
        //    dueDate: leaseDoc.startDate,
        //    desc: 'Rent'
        //    //amtDue: (rent / days in month) * # of days renting
        //});
        //console.log("Days In Month");
        //console.log(moment(leaseDoc.startDate).daysInMonth());
        //
        //console.log("Days of renting");

        //Dates in between

        //Add last month rent, prorate if necessary
    }
});