//Method to check whether it's the current user's document
Security.defineMethod("ifIsCurrentUser", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId, doc) {
        return userId !== doc.userId;
    }
});

Properties.permit('insert').ifLoggedIn().apply();
Properties.permit(['update', 'remove']).ifIsCurrentUser().apply();

Units.permit('insert').ifLoggedIn().apply();
Units.permit(['update', 'remove']).ifIsCurrentUser().apply();

Tenants.permit('insert').ifLoggedIn().apply();
Tenants.permit(['update', 'remove']).ifIsCurrentUser().apply();
