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