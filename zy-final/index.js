$('#nav-right').on('click', () => {
    if($('#toggle-nav').data('status') === 0) {
        $('#toggle-nav').fadeIn();
        $('#toggle-nav').data('status', 1);
    } else {
        $('#toggle-nav').fadeOut();
        $('#toggle-nav').data('status', 0);
    }
});

var resizeDisplay = function() {
    var windowHeight = $(window).height() - $('#header').height();
    $('#display').css('height', windowHeight + 'px');
}

$(function() {
    resizeDisplay(); 
})

$(window).on('resize', function() {
    resizeDisplay();
})

$('#detail-us>a').hover(() => {
    let that = '#detail-us>a';
    $(that).animate({
        backgroundColor: '#d80808',
        color: 'white',
        borderColor: '#d80808'
    },200);
});

$('#detail-us>a').mouseout(() => {
    let that = '#detail-us>a';
    $(that).animate({
        backgroundColor: '#f2f5f8',
        color: 'black',
        borderColor: 'black'
    },0);
});


$('#detail-team>a').hover(() => {
    let that = '#detail-team>a';
    $(that).animate({
        backgroundColor: '#d80808',
        color: 'white',
        borderColor: '#d80808'
    },200);
});

$('#detail-team>a').mouseout(() => {
    let that = '#detail-team>a';
    $(that).animate({
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'black'
    },0);
});


$('#header').on('click', '.toggle-li>a', function(event) {
    event.preventDefault();
    // console.log('yes');
    let tar = $(event.target).next();
    let toguls = $('.toggle-ul');
    // console.log(toguls);
    // console.log(tar[0]);
    
    if(tar.data('status') === 0) {
        for(ul of toguls) {
            if($(ul)[0] != tar[0]) {
                // console.log($(ul).data('status'));
                if($(ul).data('status') === 1) {
                    $(ul).fadeOut();
                }
            }
        }
        tar.fadeIn();
        tar.data('status', 1);
    } else {
        tar.fadeOut();
        tar.data('status', 0);
    }
    
});


