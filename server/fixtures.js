//Create test user if no users have been created
var testUserId;
if (Meteor.users.find().count() === 0) {
    testUserId = Accounts.createUser({
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
        check(this.userId, testUserId);

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
    }
});



