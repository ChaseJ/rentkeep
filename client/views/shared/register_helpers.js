Template.registerHelper("isEqual",function(left,right){
    return left===right;
});

Template.registerHelper("formatDate", function(value){
    return moment.isDate(value) ? moment.utc(value).format("M/D/YY") : value;
});

Template.registerHelper("formatDatetime", function(value){
    //Check if browser supports toLocaleString
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    function toLocaleStringSupportsLocales() {
        try {
            new Date().toLocaleString('i');
        } catch (e) {
            return e.name === 'RangeError';
        }
        return false;
    }

    if(toLocaleStringSupportsLocales){
        return moment(value).format("MMM Do YYYY, h:mm a") + ' ' + value.toLocaleString('en', {timeZoneName:'short'}).split(' ').pop();
    } else {
        return moment(value).format("MMM Do YYYY, h:mm a");
    }
});

Template.registerHelper("formatCurrency", function(value){
    return numeral(value).format('$0,0[.]00');
});

Template.registerHelper("isLate", function(value){
    if (value === 'Late' || value ==='Late (Partial)') {
        return 'text-danger';
    } else {
        return '';
    }
});

Template.registerHelper("dpOpts", function() {
    return dpOptions;
});

Template.registerHelper("s2Opts", function() {
    return {
        theme: "bootstrap",
        width: "style",
        placeholder: "Search..."
    };
});

Template.registerHelper("Schemas", Schemas);