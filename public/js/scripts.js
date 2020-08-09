
$(document).ready(function(){
    $('.pagination-button').on('click', function(){
        $('.pagination').addClass('hidden');
        const id = $(this).attr('id');
        $(`#pagination-display-${id}`).removeClass('hidden');
        $('.active').removeClass('active');
        $(this).addClass('active');
    });


});

