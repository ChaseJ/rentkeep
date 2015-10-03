Template.homeInvoices.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = new ReactiveVar('all');
    instance.dueDate = new ReactiveVar();
    Session.set('invoiceId','');

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

Template.homeInvoices.onRendered(function () {
    //Initialize datepicker
    var dpInvoices = $('#datepicker-invoices');
    dpInvoices.datepicker(dpOptions);

    var today = new Date();
    var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000)); //UTC midnight

    dpInvoices.datepicker('setUTCDate', todayAdj);

    //Reset form when modal closes
    $('#updateInvoiceModal').on('hidden.bs.modal', function () {
        AutoForm.resetForm('updateInvoiceForm');
    });
});

Template.homeInvoices.events({
    'change #property-select-invoices': function(e) {
        e.preventDefault();
        Template.instance().propertyId.set($(e.target).val());
    },
    'change #datepicker-invoices': function(e) {
        e.preventDefault();
        Template.instance().dueDate.set($('#datepicker-invoices').datepicker('getUTCDate'));
    }
});

Template.homeInvoices.helpers({
    properties: function() {
        return Template.instance().properties();
    },
    invoices: function() {
        return Template.instance().invoices();
    }
});