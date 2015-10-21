Template.atLayout.onRendered(function () {
    $('body').addClass('at-body');
});

Template.atLayout.onDestroyed(function () {
    $('body').removeClass('at-body');
});