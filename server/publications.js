Meteor.publish('property', function(propertyId) {
    check(propertyId, String);
    return Properties.find({_id: propertyId});
});

Meteor.publish('properties', function() {
    return Properties.find({userId: this.userId});
});

Meteor.publish('units', function() {
    return Units.find({userId: this.userId});
});

Meteor.publish('unitsByProperty', function(propertyId) {
    check(propertyId, String);
    return Units.find({propertyId: propertyId});
});

Meteor.publish('unit', function(unitId) {
    check(unitId, String);
    return Units.find({_id: unitId});
});

Meteor.publish('tenants', function() {
    return Tenants.find({userId: this.userId});
});

Meteor.publish('tenantsById', function(tenantIds) {
    check(tenantIds, [String]);
    return Tenants.find({_id: {$in: tenantIds} });
});

Meteor.publish('leases', function() {
    return Leases.find({userId: this.userId});
});

Meteor.publish('leasesByUnit', function(unitId) {
    check(unitId, String);
    return Leases.find({unitId: unitId});
});

Meteor.publish('transactions', function() {
    return Transactions.find({});
});

Meteor.publish('transactionsByLease', function(leaseId) {
    check(leaseId, String);
    return Transactions.find({leaseId: leaseId});
});

Meteor.publish('expenses', function() {
    return Expenses.find({userId: this.userId});
});

Meteor.publish('expensesByProperty', function(propertyId) {
    check(propertyId, String);
    return Expenses.find({propertyId: propertyId});
});

Meteor.publish('documentsByLease', function(leaseId) {
    check(leaseId, String);
    return Documents.find({leaseId: leaseId});
});

Meteor.publish('dueTransactions', function(days) {
    var today = new Date();
    var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000));
    var compareDate = new Date(todayAdj.setDate(todayAdj.getDate()+days));
    return Transactions.find({userId: this.userId, dueDate: { $lt: compareDate }, balance: { $gt: 0 }});
});