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
        if(leaseDoc.depositAmt){
            var depositDoc = _.extend(transDoc, {
                dueDate: leaseDoc.startDate,
                desc: 'Deposit',
                amtDue: leaseDoc.depositAmt
            });
            Transactions.insert(depositDoc);
        }

        //Create rent bills
        var rentDoc;
        var startDate = moment.utc(leaseDoc.startDate);
        var endDate = moment.utc(leaseDoc.endDate);
        var dueDateRecur = moment.recur(startDate, endDate).every(1).daysOfMonth();
        var dueDateArray = dueDateRecur.all("L");

        //If start date is not the first of the month; prorate rent and add bill
        if(startDate.date()!==1){
            var daysInStartMonth = moment.utc(leaseDoc.startDate).daysInMonth();
            var endOfStartMonth = moment.utc(leaseDoc.startDate).endOf('month');
            var rentDaysInStartMonth = endOfStartMonth.diff(startDate, 'days')+1;
            var amtDueStartMonth = Math.round(leaseDoc.rentAmt / daysInStartMonth * rentDaysInStartMonth);

            rentDoc = _.extend(transDoc, {
                dueDate: leaseDoc.startDate,
                desc: 'Rent',
                amtDue: amtDueStartMonth
            });
            Transactions.insert(rentDoc);
        }

        //Add rent bills for all due dates except last month
        for(var i = 0; i < dueDateArray.length - 1; i++){
            rentDoc = _.extend(transDoc, {
                dueDate: moment.utc(dueDateArray[i], 'MM/DD/YYYY').toISOString(),
                desc: 'Rent',
                amtDue: leaseDoc.rentAmt
            });
            Transactions.insert(rentDoc);
        }

        //Prorate rent for last month
        var daysInEndMonth = moment.utc(leaseDoc.endDate).daysInMonth();
        var startOfEndMonth = moment.utc(leaseDoc.endDate).startOf('month');
        var rentDaysInEndMonth = endDate.diff(startOfEndMonth, 'days')+1;
        var amtDueEndMonth = Math.round(leaseDoc.rentAmt / daysInEndMonth * rentDaysInEndMonth);

        rentDoc = _.extend(transDoc, {
            dueDate: moment.utc(dueDateArray[dueDateArray.length - 1], 'MM/DD/YYYY').toISOString(),
            desc: 'Rent',
            amtDue: amtDueEndMonth
        });
        Transactions.insert(rentDoc);

        return leaseId;
    },
    leaseUpdate: function(leaseId, leaseModifier){
        check(leaseId, String);
        check(this.userId, Leases.findOne(leaseId).userId);

        Leases.update(
            {_id: leaseId},
            leaseModifier
        );
    },
    leaseRemove: function(leaseId){
        check(leaseId, String);
        check(this.userId, Leases.findOne(leaseId).userId);

        Leases.remove({_id: leaseId});

        Transactions.remove({leaseId: leaseId});
    }
});