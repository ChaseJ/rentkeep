//Create test user if no users have been created
if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
        email : 'test@rentkeep.com',
        password : 'password',
        profile  : {
            companyName: 'Test Company',
            firstName: 'Test',
            lastName: 'User'
        }
    });
}

//Methods to run on client to load test data
Meteor.methods({
    insertTestUserData: function() {
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        Meteor.call('insertTestTenantData');
        Meteor.call('insertTestPropertyData');
    },
    removeTestUserData: function() {
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        var userId = Meteor.user()._id;

        Properties.remove({userId: userId});
        Units.remove({userId: userId});
        Leases.remove({userId: userId});
        Transactions.remove({userId: userId});
        Documents.remove({userId: userId});
        Tenants.remove({userId: userId});
    },
    insertTestPropertyData: function(){
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        var properties = [
            {street:'414 E Market St',      city:'Iowa City',       state:'IA',     postalCode:'52245'},
            {street:'509 S Jefferson St',   city:'Sigourney',       state:'IA',     postalCode:'52591'},
            {street:'907 E Pleasant Valley',city:'Sigourney',       state:'IA',     postalCode:'52591'},
            {street:'500 N Ellis St',       city:'Keota',           state:'IA',     postalCode:'52248'},
            {street:'25 Byington Road',     city:'Iowa City',       state:'IA',     postalCode:'52242'},
            {street:'301 N Clinton St',     city:'Iowa City',       state:'IA',     postalCode:'52242'},
            {street:'413 N Clinton St',     city:'Iowa City',       state:'IA',     postalCode:'52242'},
            {street:'1110 N Dubuque St',    city:'Iowa City',       state:'IA',     postalCode:'52242'},
            {street:'449 N Riverside Dr',   city:'Iowa City',       state:'IA',     postalCode:'52240'},
            {street:'320 Grand Ave',        city:'Iowa City',       state:'IA',     postalCode:'52242'},
            {street:'245 Sugar Creek Ln',   city:'North Liberty',   state:'IA',     postalCode:'52317'},
            {street:'125 E Zeller St',      city:'North Liberty',   state:'IA',     postalCode:'52317'}
        ];
        var units = [
            [],
            ['100','200'],
            ['100', '101', '200', '201', '300'],
            ['100', '110', '120', '200', '210', '300', '310']
        ];

        _.each(properties, function(property) {
            Meteor.call('propertyInsert', property, _.sample(units));
        })
    },
    insertTestTenantData: function() {
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        var tenants = [
            {firstName:'John',      lastName:'Doe',         phone:'(555) 555-5555',    email:'john@example.com'},
            {firstName:'Steve',     lastName:'Johnson',     phone:'(555) 555-1234',    email:'steve@example.com'},
            {firstName:'Wendy',     lastName:'Lewis',       phone:'(555) 555-3214',    email:'wendy@example.com'},
            {firstName:'Carl',      lastName:'Black',       phone:'(555) 555-0823',    email:'carl@example.com'},
            {firstName:'James',     lastName:'Allen',       phone:'(555) 555-0012',    email:'james@example.com'},
            {firstName:'Mary',      lastName:'Johnson',     phone:'(555) 555-0992',    email:'mary@example.com'},
            {firstName:'David',     lastName:'White',       phone:'(555) 555-4581',    email:'david@example.com'},
            {firstName:'Kyle',      lastName:'Washington',  phone:'(555) 555-0331',    email:'kyle@example.com'},
            {firstName:'Chase',     lastName:'Madison',     phone:'(555) 555-8029',    email:'chase@example.com'},
            {firstName:'Stephanie', lastName:'Brown',       phone:'(555) 555-5435',    email:'stephanie@example.com'},
            {firstName:'Brian',     lastName:'James',       phone:'(555) 555-3215',    email:'brian@example.com'},
            {firstName:'Sue',       lastName:'Peterson',    phone:'(555) 555-0002',    email:'sue@example.com'}
        ];

        _.each(tenants, function(tenant) {
            Meteor.call('tenantInsert', tenant);
        })
    }
});



