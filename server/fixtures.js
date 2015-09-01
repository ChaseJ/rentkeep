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
        Meteor.call('insertTestActiveLeaseData');
        Meteor.call('updateTestTransactions');
        Meteor.call('insertTestExpenseData')
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
        Expenses.remove({userId: userId});
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

        _.each(properties, function(property, index) {
            var units = [];
            switch(index % 3) {
                case 1:
                    units = ['100','200'];
                    break;
                case 2:
                    units = ['100', '101', '200', '201', '300'];
                    break;
                default:
                    units = [];

            }
            Meteor.call('propertyInsert', property, units);
        })
    },
    insertTestTenantData: function() {
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        var tenants = [
            {firstName:'James',     lastName:'Smith',       phone:'(555) 555-0000',    email:'james@example.com'},
            {firstName:'Mary',      lastName:'Johnson',     phone:'(555) 555-0001',    email:'mary@example.com'},
            {firstName:'John',      lastName:'Williams',    phone:'(555) 555-0002',    email:'john@example.com'},
            {firstName:'Patricia',  lastName:'Brown',       phone:'(555) 555-0003',    email:'pat@example.com'},
            {firstName:'Robert',    lastName:'Jones',       phone:'(555) 555-0004',    email:'robert@example.com'},
            {firstName:'Jennifer',  lastName:'Miller',      phone:'(555) 555-0005',    email:'jenn@example.com'},
            {firstName:'Michael',   lastName:'Davis',       phone:'(555) 555-0006',    email:'michael@example.com'},
            {firstName:'Elizabeth', lastName:'Garcia',      phone:'(555) 555-0007',    email:'beth@example.com'},
            {firstName:'William',   lastName:'Rodriquez',   phone:'(555) 555-0008',    email:'will@example.com'},
            {firstName:'Linda',     lastName:'Wilson',      phone:'(555) 555-0009',    email:'linda@example.com'},
            {firstName:'David',     lastName:'Anderson',    phone:'(555) 555-0010',    email:'david@example.com'},
            {firstName:'Barbara',   lastName:'Taylor',      phone:'(555) 555-0011',    email:'barbara@example.com'},
            {firstName:'Richard',   lastName:'Thomas',      phone:'(555) 555-0012',    email:'richard@example.com'},
            {firstName:'Susan',     lastName:'Moore',       phone:'(555) 555-0013',    email:'susan@example.com'},
            {firstName:'Joseph',    lastName:'Martin',      phone:'(555) 555-0014',    email:'joe@example.com'},
            {firstName:'Margaret',  lastName:'Jackson',     phone:'(555) 555-0015',    email:'margaret@example.com'},
            {firstName:'Charles',   lastName:'Thompson',    phone:'(555) 555-0016',    email:'charles@example.com'},
            {firstName:'Jessica',   lastName:'White',       phone:'(555) 555-0017',    email:'jessica@example.com'},
            {firstName:'Thomas',    lastName:'Lopez',       phone:'(555) 555-0018',    email:'thomas@example.com'},
            {firstName:'Sarah',     lastName:'Lee',         phone:'(555) 555-0019',    email:'sarah@example.com'},
            {firstName:'Chris',     lastName:'Harris',      phone:'(555) 555-0020',    email:'chris@example.com'},
            {firstName:'Dorothy',   lastName:'Clark',       phone:'(555) 555-0021',    email:'dorothy@example.com'},
            {firstName:'Daniel',    lastName:'Lewis',       phone:'(555) 555-0022',    email:'daniel@example.com'},
            {firstName:'Karen',     lastName:'Robinson',    phone:'(555) 555-0023',    email:'karen@example.com'},
            {firstName:'Matt',      lastName:'Walker',      phone:'(555) 555-0024',    email:'matt@example.com'},
            {firstName:'Nancy',     lastName:'Perez',       phone:'(555) 555-0025',    email:'nancy@example.com'},
            {firstName:'Donald',    lastName:'Hall',        phone:'(555) 555-0026',    email:'donald@example.com'},
            {firstName:'Betty',     lastName:'Young',       phone:'(555) 555-0027',    email:'betty@example.com'},
            {firstName:'Anthony',   lastName:'King',        phone:'(555) 555-0028',    email:'anthony@example.com'},
            {firstName:'Lisa',      lastName:'Scott',       phone:'(555) 555-0029',    email:'lisa@example.com'},
            {firstName:'Mark',      lastName:'Green',       phone:'(555) 555-0030',    email:'mark@example.com'},
            {firstName:'Sandra',    lastName:'Baker',       phone:'(555) 555-0031',    email:'sandra@example.com'},
            {firstName:'Paul',      lastName:'Smith',       phone:'(555) 555-0032',    email:'paul@example.com'},
            {firstName:'Ashley',    lastName:'Harris',      phone:'(555) 555-0033',    email:'ashley@example.com'},
            {firstName:'Steven',    lastName:'Johson',      phone:'(555) 555-0034',    email:'steven@example.com'},
            {firstName:'Kim',       lastName:'Lewis',       phone:'(555) 555-0035',    email:'kim@example.com'},
            {firstName:'George',    lastName:'Robinson',    phone:'(555) 555-0036',    email:'george@example.com'},
            {firstName:'Donna',     lastName:'Walker',      phone:'(555) 555-0037',    email:'donna@example.com'},
            {firstName:'Ken',       lastName:'Williams',    phone:'(555) 555-0038',    email:'ken@example.com'},
            {firstName:'Helen',     lastName:'Hall',        phone:'(555) 555-0039',    email:'helen@example.com'},
            {firstName:'Andrew',    lastName:'Black',       phone:'(555) 555-0040',    email:'andrew@example.com'},
            {firstName:'Carol',     lastName:'King',        phone:'(555) 555-0041',    email:'carol@example.com'},
            {firstName:'Edward',    lastName:'Davis',       phone:'(555) 555-0042',    email:'ed@example.com'},
            {firstName:'Michelle',  lastName:'Green',       phone:'(555) 555-0043',    email:'michelle@example.com'}
        ];

        _.each(tenants, function(tenant) {
            Meteor.call('tenantInsert', tenant);
        })
    },
    insertTestActiveLeaseData: function(){
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        var userId = Meteor.user()._id;
        var units = Units.find({userId: userId});
        var tenantsObjects = Tenants.find({userId: userId}, {fields: {_id: 1}}).fetch();
        var tenants = _.map(tenantsObjects, function(tenantObj){return tenantObj._id});
        var rentAmounts = [1000, 500, 750];
        var startDates = [
            moment.utc().startOf('day').startOf('month').toISOString(),
            moment.utc().startOf('day').startOf('month').subtract(1, 'months').toISOString(),
            moment.utc().startOf('day').subtract(1, 'months').toISOString()
        ];
        var leaseLengths = [1,2,5,11,11,11];

        var unitsCount = 1;
        var tenantsCount = 0;
        var leaseDoc;
        var rentAmt;
        var startDate;
        var endDate;
        var tenantArray;

        units.forEach(function(unit) {
            if(unitsCount % 8 !== 0){
                rentAmt = _.sample(rentAmounts);
                startDate = _.sample(startDates);
                endDate = moment.utc(startDate).add(_.sample(leaseLengths), 'months').endOf('month').startOf('day').toISOString();

                switch(unitsCount % 8) {
                    case 5:
                        tenantArray = [tenants[tenantsCount],tenants[tenantsCount+1]];
                        tenantsCount = tenantsCount + 2;
                        break;
                    case 6:
                        tenantArray = [tenants[tenantsCount],tenants[tenantsCount+1]];
                        tenantsCount = tenantsCount + 2;
                        break;
                    case 7:
                        tenantArray = [tenants[tenantsCount],tenants[tenantsCount+1], tenants[tenantsCount+2]];
                        tenantsCount = tenantsCount + 3;
                        break;
                    default:
                        tenantArray = [tenants[tenantsCount]];
                        tenantsCount = tenantsCount + 1;
                }

                leaseDoc = {
                    unitId: unit._id,
                    propertyId: unit.propertyId,
                    rentAmt: rentAmt,
                    depositAmt: rentAmt,
                    startDate: startDate,
                    endDate: endDate,
                    tenants: tenantArray
                };

                Meteor.call('leaseInsert', leaseDoc);
            }
            unitsCount++;
        });
    },
    updateTestTransactions: function() {
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        var userId = Meteor.user()._id;
        var today = new Date();
        var todayAdj = new Date(today.setHours(0,0,0,0) - (today.getTimezoneOffset() * 60000));
        var transactions = Transactions.find({userId: userId, dueDate: { $lt: todayAdj }}, {sort: {dueDate: 1}});
        var transactionsCount = transactions.count();
        var transModifier;
        var counter = 0;

        transactions.forEach(function(transaction) {
            if(counter < (transactionsCount-3)) {
                transModifier = {
                    '$set': {
                        amtDue: transaction.amtDue,
                        amtPaid: transaction.amtDue,
                        paidDate: transaction.dueDate,
                        balance: 0
                    }
                };
                Meteor.call('transactionUpdate', transModifier, transaction._id);
                counter++;
            }
        });
    },
    insertTestExpenseData: function() {
        check(Meteor.user().emails[0].address, 'test@rentkeep.com');

        var userId = Meteor.user()._id;
        var properties = Properties.find({userId: userId});
        var units = Units.find({userId: userId});
        var payees = ['Acme', 'ABC Corp', 'XYZ Inc', 'Southeastern Co.'];
        var descriptions = ['Painting', 'General Repairs', 'Coop Fee', 'Plumbing'];
        var amounts = [100, 200, 500, 1000];
        var expDates = [
            moment.utc().startOf('day').startOf('month').toISOString(),
            moment.utc().startOf('day').subtract(1, 'months').toISOString(),
            moment.utc().startOf('day').subtract(3, 'months').toISOString(),
            moment.utc().startOf('day').subtract(6, 'months').toISOString(),
            moment.utc().startOf('day').subtract(12, 'months').toISOString()
        ];

        var unitCounter = 0;
        var propertyCounter = 0;
        var expenseDoc;
        var expDate;
        var payee;
        var desc;
        var amount;

        units.forEach(function(unit) {
            if(unitCounter % 5 !== 0 && unit.unitNo !== '1'){
                for(var i = 0; i < Math.round(Math.random()*10); i++){
                    expDate = _.sample(expDates);
                    payee = _.sample(payees);
                    desc = _.sample(descriptions);
                    amount = _.sample(amounts);

                    expenseDoc = {
                        propertyId: unit.propertyId,
                        unitId: unit._id,
                        userId: userId,
                        expDate: expDate,
                        payee: payee,
                        desc: desc,
                        amount: amount
                    };

                    Meteor.call('expenseInsert', expenseDoc);
                }
            }
            unitCounter++;
        });

        properties.forEach(function(property) {
            if(propertyCounter % 4 !== 0){
                for(var i = 0; i < Math.round(Math.random()*10); i++){
                    expenseDoc = {
                        propertyId: property._id,
                        unitId: 'property',
                        userId: userId,
                        expDate: moment.utc().startOf('day').subtract(i, 'months').toISOString(),
                        payee: 'Johnson Lawn Care',
                        desc: 'Mowing',
                        amount: 100
                    };

                    Meteor.call('expenseInsert', expenseDoc);
                }
            }
            propertyCounter++;
        });
    }
});