//Method to check whether it's the current user's document
Security.defineMethod("ifIsCurrentUser", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId, doc) {
        return userId !== doc.userId;
    }
});

Security.permit('insert').collections([Documents]).ifLoggedIn().apply();
Security.permit(['update','remove','download']).collections([Documents]).ifIsCurrentUser().apply();
