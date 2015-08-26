Template.printLayout.events({
    'click #print-popup-btn': function(e) {
        e.preventDefault();
        window.print();
    },
    'click #close-popup-btn': function(e) {
        e.preventDefault();
        window.close();
    }
});