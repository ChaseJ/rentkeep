/*
    Router configuration
*/
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});


/*
    Router controllers
*/
PrintController = RouteController.extend({
    layoutTemplate: 'printLayout',
    onBeforeAction: function() {
        $('body').addClass('print-body');
        this.next()
    }
});


/*
    Application template routes
*/
Router.route('/home', {
    name: 'home'
});

Router.route('/', function () {
    this.redirect('home');
});

Router.route('/account', {
    name: 'accountSettings'
});

Router.route('/properties', {
    name: 'propertiesList'
});

Router.route('/properties/:propertyId/:_id', {
    name: 'unitView'
});

Router.route('/properties/:propertyId/:_id/leases', {
    name: 'leaseView',
    action: function() {
        this.render('unitView');
        this.render('leaseView', {to: 'unitView'});
    }
});

Router.route('/properties/:propertyId/:_id/expenses', {
    name: 'propertyExpenses',
    action: function() {
        this.render('unitView');
        this.render('propertyExpenses', {to: 'unitView'});
    }
});

Router.route('/tenants', {
    name: 'tenantsList'
});

Router.route('/reports/ledger', {
    name: 'ledgerReport',
    action: function() {
        this.render('reports');
        this.render('ledgerReport', {to: 'report'});
    }
});

Router.route('/reports/paymentsDue', {
    name: 'paymentsDueReport',
    action: function() {
        this.render('reports');
        this.render('paymentsDueReport', {to: 'report'});
    }
});

Router.route('/reports/vacancies', {
    name: 'vacanciesReport',
    action: function() {
        this.render('reports');
        this.render('vacanciesReport', {to: 'report'});
    }
});

Router.route('/reports/leases', {
    name: 'leasesReport',
    action: function() {
        this.render('reports');
        this.render('leasesReport', {to: 'report'});
    }
});

Router.route('/reports/vacancies/print', {
    name: 'vacanciesReportPrint',
    controller: 'PrintController'
});

Router.route('/reports/leases/print', {
    name: 'leasesReportPrint',
    controller: 'PrintController'
});

Router.route('/reports/paymentsDue/print', {
    name: 'paymentsDueReportPrint',
    controller: 'PrintController'
});

Router.route('/reports/ledger/print', {
    name: 'ledgerReportPrint',
    controller: 'PrintController'
});

Router.route('/tenants/print', {
    name: 'tenantsListPrint',
    controller: 'PrintController'
});


/*
    Account Template routes
*/
AccountsTemplates.configureRoute('ensureSignedIn', {
    template: 'atTemplate',
    layoutTemplate: 'atLayout'
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signIn',
    path: '/sign-in',
    template: 'atTemplate',
    layoutTemplate: 'atLayout',
    redirect: 'home'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    path: '/sign-up',
    template: 'atTemplate',
    layoutTemplate: 'atLayout',
    redirect: 'home'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgotPwd',
    path: '/forgot-password',
    template: 'atTemplate',
    layoutTemplate: 'atLayout',
    redirect: 'home'
});


AccountsTemplates.configureRoute('resetPwd', {
    name: 'resetPwd',
    path: '/reset-password',
    template: 'atTemplate',
    layoutTemplate: 'atLayout',
    redirect: 'home'
});

AccountsTemplates.configureRoute('changePwd', {
    name: 'changePwd',
    redirect: '/account'
});

Router.plugin('ensureSignedIn', {
    except: ['signIn', 'resetPwd', 'forgotPwd', 'signUp']
});
