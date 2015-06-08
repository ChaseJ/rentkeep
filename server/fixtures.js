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
    insertTestPropertyData: function(){
        var unitsOne = ['1'];
        var unitsTwo = ['100','200'];
        var unitsFive = ['100', '101', '200', '201', '300'];
        var unitsSeven = ['100', '110', '120', '200', '210', '300', '310'];

        var properties = [
            {street:'414 E Market St',      city:'Iowa City',       state:'IA',     postalCode:'52245',     units:unitsTwo},
            {street:'509 S Jefferson St',   city:'Sigourney',       state:'IA',     postalCode:'52591',     units:unitsOne},
            {street:'907 E Pleasant Valley',city:'Sigourney',       state:'IA',     postalCode:'52591',     units:unitsFive},
            {street:'500 N Ellis St',       city:'Keota',           state:'IA',     postalCode:'52248',     units:unitsSeven},
            {street:'25 Byington Road',     city:'Iowa City',       state:'IA',     postalCode:'52242',     units:unitsOne},
            {street:'301 N Clinton St',     city:'Iowa City',       state:'IA',     postalCode:'52242',     units:unitsOne},
            {street:'413 N Clinton St',     city:'Iowa City',       state:'IA',     postalCode:'52242',     units:unitsOne},
            {street:'1110 N Dubuque St',    city:'Iowa City',       state:'IA',     postalCode:'52242',     units:unitsFive},
            {street:'449 N Riverside Dr',   city:'Iowa City',       state:'IA',     postalCode:'52240',     units:unitsOne},
            {street:'320 Grand Ave',        city:'Iowa City',       state:'IA',     postalCode:'52242',     units:unitsTwo},
            {street:'245 Sugar Creek Ln',   city:'North Liberty',   state:'IA',     postalCode:'52317',     units:unitsTwo},
            {street:'125 E Zeller St',      city:'North Liberty',   state:'IA',     postalCode:'52317',     units:unitsSeven}
        ];

        for (var i=0; i<properties.length; i++){
            var propertyId = Properties.insert({
                street: properties[i].street,
                city: properties[i].city,
                state: properties[i].state,
                postalCode: properties[i].postalCode
            });

            _.each(properties[i].units, function(unitNo){
                Units.insert({
                    propertyId: propertyId,
                    unitNo: unitNo
                })
            })
        }
    },
    insertTestTenantData: function() {
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

        for (var i=0; i<tenants.length; i++){
            Tenants.insert({
                firstName: tenants[i].firstName,
                lastName: tenants[i].lastName,
                phone: tenants[i].phone,
                email: tenants[i].email
            });
        }
    }
});



