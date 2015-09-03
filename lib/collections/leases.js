Leases = new Mongo.Collection("leases");

Leases.attachSchema(new SimpleSchema({
    unitId: {
        type: String
    },
    propertyId: {
        type: String
    },
    userId: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },
    rentAmt : {
        type: Number,
        label: 'Monthly Rent',
        decimal: true,
        max: 1000000
    },
    depositAmt : {
        type: Number,
        label: 'Deposit',
        decimal: true,
        optional: true,
        max: 1000000
    },
    startDate : {
        type: Date,
        label: 'Start Date'
    },
    endDate : {
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

Leases.helpers({
    streetAndUnit: function() {
        var unit = Units.findOne({_id: this.unitId});
        var property = Properties.findOne({_id: this.propertyId});
        if (property.isMultiUnit()){
            return property.street + ", Unit " + unit.unitNo;
        } else {
            return property.street;
        }
    },
    status: function() {
        var today = new Date();
        var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight

        if(this.startDate <= todayAdj && this.endDate >= todayAdj){
            return 'current'
        } else if(this.endDate < todayAdj) {
            return 'past'
        } else if(this.startDate > todayAdj) {
            return 'future'
        }
    }
});

Meteor.methods({
    leaseInsert: function(leaseDoc){
        check(this.userId, String);
        var leaseId = Leases.insert(leaseDoc);

        //Create transactions for bills
        var user = Meteor.user();
        var transDoc = {
            leaseId: leaseId,
            unitId: leaseDoc.unitId,
            propertyId: leaseDoc.propertyId,
            userId: user._id,
            amtPaid: 0,
            notes: ''
        };

        //Add deposit bill if necessary
        if(leaseDoc.depositAmt){
            var depositDoc = _.extend(transDoc, {
                dueDate: leaseDoc.startDate,
                desc: 'Security Deposit',
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
        if(startDate.date()!==1 && dueDateArray.length!==0){
            var daysInStartMonth = moment.utc(leaseDoc.startDate).daysInMonth();
            var endOfStartMonth = moment.utc(leaseDoc.startDate).endOf('month');
            var rentDaysInStartMonth = endOfStartMonth.diff(startDate, 'days')+1;
            var amtDueStartMonth = Math.round(leaseDoc.rentAmt / daysInStartMonth * rentDaysInStartMonth);

            rentDoc = _.extend(transDoc, {
                dueDate: leaseDoc.startDate,
                desc: 'Prorated Rent',
                amtDue: amtDueStartMonth
            });
            Transactions.insert(rentDoc);
        }

        //Add rent bills for all due dates except last month
        for(var i = 0; i < dueDateArray.length - 1; i++){
            rentDoc = _.extend(transDoc, {
                dueDate: moment.utc(dueDateArray[i], 'MM/DD/YYYY').toISOString(),
                desc: 'Monthly Rent',
                amtDue: leaseDoc.rentAmt
            });
            Transactions.insert(rentDoc);
        }

        //Prorate rent for last month if necessary
        if(dueDateArray.length!==0) {
            var daysInEndMonth = moment.utc(leaseDoc.endDate).daysInMonth();
            var startOfEndMonth = moment.utc(leaseDoc.endDate).startOf('month');
            var rentDaysInEndMonth = endDate.diff(startOfEndMonth, 'days')+1;
            var amtDueEndMonth = Math.round(leaseDoc.rentAmt / daysInEndMonth * rentDaysInEndMonth);
            var desc = (daysInEndMonth===rentDaysInEndMonth) ? 'Monthly Rent' : 'Prorated Rent';

            rentDoc = _.extend(transDoc, {
                dueDate: moment.utc(dueDateArray[dueDateArray.length - 1], 'MM/DD/YYYY').toISOString(),
                desc: desc,
                amtDue: amtDueEndMonth
            });
            Transactions.insert(rentDoc);
        }

        //If lease is less than a month, prorate rent
        if(dueDateArray.length===0) {
            var rentDaysInMonth = endDate.diff(startDate, 'days')+1;
            var daysInMonth = moment.utc(leaseDoc.endDate).daysInMonth();
            var amtDueMonth = Math.round(leaseDoc.rentAmt / daysInMonth * rentDaysInMonth);

            rentDoc = _.extend(transDoc, {
                dueDate: leaseDoc.startDate,
                desc: 'Prorated Rent',
                amtDue: amtDueMonth
            });
            Transactions.insert(rentDoc);
        }

        return leaseId;
    },
    leaseUpdate: function(leaseModifier, leaseId){
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

        Documents.remove({leaseId: leaseId});
    }
});