/*
    Router configuration
*/
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
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

//AccountsTemplates.configureRoute('changePwd', {
//    name: 'changePwd',
//    path: '/changePassword',
//    template: 'changePassword',
//    redirect: '/account'
//});

Router.plugin('ensureSignedIn', {
    except: ['signIn', 'resetPwd', 'forgotPwd', 'signUp']
});
