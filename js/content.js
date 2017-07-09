'use strict';

var infiniteLoadingGif = "<div class='infinite-loading' style='text-align:center; margin:0 auto; width:50%'><img src='https://i.imgur.com/NH1zQtD.gif'></img></div>";

function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

var back_top = $('.back_top');
var pathname = document.location.pathname;
var pageMatch = pathname.match(/page,(\d+)/);
var currPage = pageMatch ? pageMatch[1] : 1;
var requestNext = true;
pathname = pathname.replace(/\/page,\d+/, '') + '/page,' + currPage;

function getPagePath(pageNum) {
    return pathname.replace(/page,\d+/, 'page,' + pageNum);
}

function appendPageItems(pageNum) {
    console.log('loading page: ', pageNum);
    var msg = '';
    $('<div>').load(getPagePath(pageNum) + ' #catalog_products', function(html, status) {
        console.log('status: ', status);
        if (status !== 'success') {
            requestNext = false;
            msg = 'Oops. There was an error while loading the next page items (page ' + pageNum + ').';
            console.error(msg);
            $('<div id="oops_error" style="text-align:center; color:red">' + msg + '<BR><a id="try_again_btn">Try again</a></div>').insertAfter('#catalog_products');
            $('#try_again_btn').click(function() {
                $('#oops_error').remove();
                $('.infinite-loading').show();
                appendPageItems(pageNum);
            });
            $('div .catalog_browsing').show();
        } else if (html.indexOf('class="no-results"') > -1) {
            console.log('not loaded: ', pageNum);
            msg = 'No more items :(';
            console.log(msg);
            $('<div style="text-align:center">' + msg + '</div>').insertAfter('#catalog_products');
        } else {
            $('#catalog_products').append($(this));
            requestNext = true;
            console.log('loaded:', pageNum);
        }

        $('.infinite-loading').hide();
    });
}

$('div .catalog_browsing').hide();
$(infiniteLoadingGif).insertBefore('div .catalog_browsing');
$('.infinite-loading').hide();

$(window).scroll(function() {
    if (requestNext && isScrolledIntoView(back_top)) {
        $('.infinite-loading').show();
        requestNext = false;
        appendPageItems(++currPage);
    }
});
