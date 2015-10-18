Template.invoicesDueReport.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = new ReactiveVar('all');
    instance.dueDate = new ReactiveVar();
    Session.set('invoiceId','');

    //Subscriptions
    instance.subscribe('unpaidInvoices');
    instance.subscribe('properties');
    instance.subscribe('units');

    //Cursors
    instance.properties = function() {
        return Properties.find( {},{ sort: { street: 1 } });
    };
    instance.invoices = function() {
        if (instance.propertyId.get() === 'all') {
            return Invoices.find({balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate.get()}}, {sort: {dueDate: 1}});
        } else {
            return Invoices.find({propertyId: instance.propertyId.get(), balance: { $gt: 0 }, dueDate: {$lte: instance.dueDate.get()}}, {sort: {dueDate: 1}});
        }
    };
});

Template.invoicesDueReport.onRendered(function () {
    var datepicker = $('#datepicker');
    datepicker.datepicker(dpOptions);

    var today = new Date();
    var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight

    datepicker.datepicker('setUTCDate', todayAdj);
});

Template.invoicesDueReport.events({
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
        var invoicesArray = Template.instance().invoices().map(function(invoice, index) {
            //Show optional properties if not declared yet
            if(index===0) {
                if(!invoice.hasOwnProperty('notes')) {invoice.notes=''}
                if(!invoice.hasOwnProperty('refNo')) {invoice.refNo=''}
            }
            invoice.streetAndUnit = invoice.streetAndUnit();
            invoice.status = invoice.status();
            invoice.dueDate = moment.utc(invoice.dueDate).format("M/D/YY");
            invoice.paidDate = invoice.hasOwnProperty('paidDate') ? moment.utc(invoice.paidDate).format("M/D/YY") : "";
            return _.omit(invoice, ['leaseId', 'propertyId', 'unitId', 'userId', "_id"]);
        });
        var csv = Papa.unparse(invoicesArray);
        var blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, "invoicesDue.csv");
    },
    'click #export-pdf': function(e) {
        e.preventDefault();
        var data = {
            propId: Template.instance().propertyId.get(),
            date: Template.instance().dueDate.get()
        };
        var html = Blaze.toHTMLWithData(Template.invoicesDueReportPrint, data);
        html = '<link rel="stylesheet" type="text/css" href="' + window.location.protocol + '//' + window.location.host + '/pdf.css">' + html;
        Meteor.pdf.save(html, 'invoicesDue', pdfOptions);
    },
    'click #print-btn': function(e) {
        e.preventDefault();
        var dateObj = Template.instance().dueDate.get();
        var query = 'propId='+Template.instance().propertyId.get()+'&date='+dateObj.toISOString();
        window.open(Router.url('invoicesDueReportPrint',{},{query: query}),'Invoices Due Report','width=600,height=800');
    }
});

Template.invoicesDueReport.helpers({
    properties: function() {
        return Template.instance().properties();
    },
    invoices: function() {
        return Template.instance().invoices();
    }
});