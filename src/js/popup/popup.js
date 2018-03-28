'use strict';
chrome.runtime.sendMessage({request : 'wakeup'});
getConfig().then(function(config) {
    if (config.nightMode) {
        $('body').toggleClass('u-dark-mode')
        $('.c-card').each(function(index, el){
            $(el).toggleClass('u-dark-mode u--dark')
        })
    }
})

let CURRENT_SELECTED_DATE = 0
let CACHED_DATA = {
    games: [],
    d: {},
}
const onLoadPopUp = function() {
    chrome.storage.local.get(['popupRefreshTime', 'cacheData', 'fetchDataDate', 'scheduleRefreshTime', 'schedule'], function(data) {
        var popupTime = data && data.popupRefreshTime ? data.popupRefreshTime : 0
        var scheduleTime = data && data.scheduleTime ? data.scheduleTime : 0
        var d = new Date()
        // probably hasn't change much assign it first
        DATE_UTILS.setSchedule(data.schedule)
        // set up the fetch data date and selectedDate for calendar
        DATE_UTILS.fetchDataDate = data.fetchDataDate
        DATE_UTILS.selectedDate = moment(data.fetchDataDate).toDate()

        if (d.getTime() - popupTime > 60000) {
            fetchData()
            .done(function(games, date) {
                DATE_UTILS.fetchDataDate = date
                CACHED_DATA.games = games
                CACHED_DATA.d = d
            })
            .fail(function(){
                updateLastUpdate(data.popupRefreshTime);
                $('.no-game').removeClass('u-hide').text(FETCH_DATA_FAILED);
            });
        } else {
            updateLastUpdate(data.popupRefreshTime)
            updateCards(data.cacheData)
            CACHED_DATA.games = data.cacheData
            CACHED_DATA.d = data.popupRefreshTime
        }
    });
}

const onArrowClick = function() {
    if (DATE_UTILS.checkSelectToday()) {
        updateLastUpdate(CACHED_DATA.d)
        updateCards(CACHED_DATA.games)
    } else {
        updateCards(DATE_UTILS.searchGames(DATE_UTILS.selectedDate))
    }
}

const updateArrowVisibility = function() {
    $('#title').text(getTitle(CURRENT_SELECTED_DATE))
    if (CURRENT_SELECTED_DATE === 0) {
        $('#prevArrow').removeClass('u-not-visible')
        $('#nextArrow').removeClass('u-not-visible')
    } else if (CURRENT_SELECTED_DATE === -1) {
        $('#prevArrow').addClass('u-not-visible')
        $('#nextArrow').removeClass('u-not-visible')
    } else if (CURRENT_SELECTED_DATE === 1) {
        $('#prevArrow').removeClass('u-not-visible')
        $('#nextArrow').addClass('u-not-visible')
    } else {
        $('#prevArrow').removeClass('u-not-visible')
        $('#nextArrow').removeClass('u-not-visible')
    }
}

$(function(){
    chrome.tabs.getCurrent(function(tab) {
        if (!tab) {
            $('#popup_page').css('max-height', '460px')
        }
    })

    $('body').on('click', '.' + UTILS.CARD + ':not(.no-game)', function(){
        let hashedUrl = 'box-score.html#' + $(this).attr('gid');
        chrome.tabs.create({url: hashedUrl});
        window.close()
    })

    $('#boxScorePage').click(function() {
        chrome.tabs.create({ 'url': "/box-score.html" })
        window.close()
    })

    $('#optionsPage').click(function() {
        chrome.tabs.create({ 'url': "/options.html" })
        window.close()
    })

    $('#standingsPage').click(function() {
        chrome.tabs.create({ 'url': "/standings.html" })
        window.close()
    })

    $('#prevArrow').click(function(event){
        if (CURRENT_SELECTED_DATE <= -1) return
        if (DATE_UTILS.onArrowClick(-1)) {
            CURRENT_SELECTED_DATE -= 1
            updateArrowVisibility()
            onArrowClick()
        }
    })

    $('#nextArrow').click(function(event){
        if (CURRENT_SELECTED_DATE >= 1) return
        if (DATE_UTILS.onArrowClick(1)) {
            CURRENT_SELECTED_DATE += 1
            updateArrowVisibility()
            onArrowClick()
        }
    })

    onLoadPopUp()
});
