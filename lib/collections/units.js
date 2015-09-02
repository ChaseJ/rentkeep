Units = new Mongo.Collection("units");

Units.attachSchema(new SimpleSchema({
    unitNo: {
        type: String,
        label: "Unit Number",
        max: 32
    },
    propertyId: {
        type: String
    },
    userId: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    }
}));

Units.helpers({
    streetAndUnit: function() {
        var property = Properties.findOne({_id: this.propertyId});
        if (property.isMultiUnit()){
            return property.street + ", Unit " + this.unitNo;
        } else {
            return property.street;
        }
    },
    currentLeaseEnds: function() {
        var today = new Date();
        var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight
        var leases = Leases.find({unitId: this._id});
        var status = "Vacant";
        leases.forEach(function(lease){
            if(lease.startDate <= todayAdj && lease.endDate >= todayAdj){
                status = lease.endDate;
            }
        });
        return status;
    },
    nextLeaseStarts: function(){
        var today = new Date();
        var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight
        var leases = Leases.find({unitId: this._id}, {sort: {startDate: 1}});
        var status = "No future lease.";
        leases.forEach(function(lease){
            if(lease.startDate > todayAdj){
                status = lease.startDate;
            }
        });
        return status;
    }
});

Meteor.methods({
    unitUpdate: function(unitModifier, unitId){
        check(unitId, String);
        check(this.userId, Units.findOne(unitId).userId);

        Units.update(
            {_id: unitId},
            unitModifier
        );
    },
    unitRemove: function(unitId){
        check(unitId, String);
        check(this.userId, Units.findOne(unitId).userId);

        Units.remove({_id: unitId});

        var leases = Leases.find({unitId: unitId});
        leases.forEach(function(lease){
            Meteor.call('leaseRemove', lease._id);
        });

        Expenses.remove({unitId: unitId});
    }
});
