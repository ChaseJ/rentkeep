var myLogoutFunc = function(){
    Router.go('/sign-in');
};

AccountsTemplates.addField({
    _id: "companyName",
    type: 'text',
    required: true,
    placeholder: "Company Name",
    displayName: "Company Name"
});

AccountsTemplates.addField({
    _id: "firstName",
    type: 'text',
    required: true,
    placeholder: "First Name",
    displayName: "First Name"
});

AccountsTemplates.addField({
    _id: "lastName",
    type: 'text',
    required: true,
    placeholder: "Last Name",
    displayName: "Last Name"
});

AccountsTemplates.configure({
    showForgotPasswordLink: true,
    enablePasswordChange: true,
    onLogoutHook: myLogoutFunc,
    texts: {
        title: {
            changePwd: ""
        }
    }
});
