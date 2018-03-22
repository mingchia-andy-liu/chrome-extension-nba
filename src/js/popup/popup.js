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
            })
            .fail(function(){
                updateLastUpdate(data.popupRefreshTime);
                $('.no-game').removeClass('u-hide').text(FETCH_DATA_FAILED);
            });
        } else {
            updateLastUpdate(data.popupRefreshTime)
            updateCards(data.cacheData)
        }
    });
});
