Template.vacanciesReportPrint.onCreated(function () {
    //Initialization
    var instance = this;
    instance.propertyId = Router.current().params.query.propId ? Router.current().params.query.propId : this.data.propId;
    instance.vacanciesDate = Router.current().params.query.date ? new Date(Router.current().params.query.date) : this.data.date;

    //Subscriptions
    instance.subscribe('properties');
    instance.subscribe('units');
    instance.subscribe('leases');

    //Cursors & Arrays
    instance.property = function() {
        return Properties.findOne( {_id: instance.propertyId} );
    };
    instance.units = function() {
        if (instance.propertyId === 'all') {
            return Units.find({});
        } else {
            return Units.find({propertyId: instance.propertyId});
        }
    };
    instance.vacancies = function() {
        var date = instance.vacanciesDate;

        var unitArray = Template.instance().units().map(function(unit) {
            var vacant = true;
            var leases = Leases.find({unitId: unit._id});

            leases.forEach(function(lease){
                if(lease.startDate <= date && lease.endDate >= date){
                    vacant = false;
                }
            });

            if(vacant){
                return unit;
            }
        });

        return _.compact(unitArray);
    };
});

Template.vacanciesReportPrint.helpers({
    property: function() {
        return Template.instance().property();
    },
    vacancies: function() {
        return Template.instance().vacancies();
    },
    date: function() {
        return Template.instance().vacanciesDate;
    }
});