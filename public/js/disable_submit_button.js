(function() {
    $(document).on("submit", "#feedForm", function(event) {
        var elem = $(event.currentTarget);
        $('#submitbutton').addClass('active');
        $('#submitbutton').attr('disabled', 'disabled');
        setTimeout(function() {
            $('#submitbutton').removeClass('active');
        }, 5000);

        $.ajax({
            url: "/updating_achievement",
            data: {
                delay: 1
            },
        }).always(function() {
            $('#submitbutton').prop('disabled', false);
            $('#submitbutton').removeClass('active');
        });
    });
})();