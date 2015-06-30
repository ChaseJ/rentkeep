Template.registerHelper("isEqual",function(left,right){
    return left===right;
});

Template.registerHelper("formatDate", function(value){
    return moment.utc(value).format("M/D/YY");
});

Template.registerHelper("formatCurrency", function(value){
    return numeral(value).format('$0,0[.]00');
});

Template.registerHelper("isLate", function(value){
    return value==='Late' ? 'text-danger' : '';
});

Template.registerHelper("dpOpts", function() {
    return {
        autoclose: true,
        startDate: "1/1/2000" //stops users from entering '15' and assuming the date saved is 2015
    };
});

Template.registerHelper("s2Opts", function() {
    return {
        theme: "bootstrap",
        width: "style",
        placeholder: "Search..."
    };
});