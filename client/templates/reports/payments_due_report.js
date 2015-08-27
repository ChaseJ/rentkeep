Template.paymentsDueReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = new ReactiveVar('all');
    instance.dueDate = new ReactiveVar();
    Session.set('transactionId','');

    //Subscriptions
    instance.subscribe('unpaidTransactions');
    instance.subscribe('properties');
    instance.subscribe('units');

    //Cursors
    instance.properties = function() {
        return Properties.find( {},{ sort: { street: 1 } });
    };
    instance.transactions = function() {
        if (instance.propertyId.get() === 'all') {
            return Transactions.find({balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate.get()}}, {sort: {dueDate: 1}});
        } else {
            return Transactions.find({propertyId: instance.propertyId.get(), balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate.get()}}, {sort: {dueDate: 1}});
        }
    };
});

Template.paymentsDueReport.onRendered(function () {
    var datepicker = $('#datepicker');
    datepicker.datepicker({
        autoclose: true,
        orientation: 'top',
        startDate: "1/1/2000" //stops users from entering '15' and assuming the date saved is 2015
    });

    var today = new Date();
    var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight

    datepicker.datepicker('setUTCDate', todayAdj);
});

Template.paymentsDueReport.events({
    'change #property-select': function(e) {
        e.preventDefault();
        Template.instance().propertyId.set($(e.target).val());
    },
    'change #datepicker': function(e) {
        e.preventDefault();
        Template.instance().dueDate.set($('#datepicker').datepicker('getUTCDate'));
    },
    'click #export-csv': function(e) {
        e.preventDefault();
        var transactionsArray = Template.instance().transactions().map(function(transaction, index) {
            //Show optional properties if not declared yet
            if(index===0) {
                if(!transaction.hasOwnProperty('notes')) {transaction.notes=''}
                if(!transaction.hasOwnProperty('refNo')) {transaction.refNo=''}
            }
            transaction.streetAndUnit = transaction.streetAndUnit();
            transaction.status = transaction.status();
            transaction.dueDate = moment.utc(transaction.dueDate).format("M/D/YY");
            transaction.paidDate = transaction.hasOwnProperty('paidDate') ? moment.utc(transaction.paidDate).format("M/D/YY") : "";
            return _.omit(transaction, ['leaseId', 'propertyId', 'unitId', 'userId', "_id"]);
        });
        var csv = Papa.unparse(transactionsArray);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "paymentsDue.csv");
    },
    'click #export-pdf': function(e) {
        e.preventDefault();
        var data = {
            propId: Template.instance().propertyId.get(),
            date: Template.instance().dueDate.get()
        };
        var html = Blaze.toHTMLWithData(Template.paymentsDueReportPrint, data);
        html = '<link rel="stylesheet" type="text/css" href="' + window.location.protocol + '//' + window.location.host + '/pdf.css">' + html;
        Meteor.pdf.save(html, 'paymentsDue', pdfOptions);
    },
    'click .print-btn': function(e) {
        e.preventDefault();
        var dateObj = Template.instance().dueDate.get();
        var query = 'propId='+Template.instance().propertyId.get()+'&date='+dateObj.toISOString();
        window.open(Router.url('paymentsDueReportPrint',{},{query: query}),'Payments Due Report','width=600,height=800');
    }
});

Template.paymentsDueReport.helpers({
    properties: function() {
        return Template.instance().properties();
    },
    transactions: function() {
        return Template.instance().transactions();
    }
});