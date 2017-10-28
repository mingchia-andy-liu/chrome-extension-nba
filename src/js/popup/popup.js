$(function(){
    'use strict';

    $('body').on('click', '.' + UTILS.CARD + ':not(.no-game)', function(){
        let hashedUrl = 'box-score.html#' + $(this).attr('gid');
        chrome.tabs.create({url: hashedUrl});
    });

    $('#boxScorePage').on('click', function() {
        chrome.tabs.create({'url': "/box-score.html" })
    });

    $('#optionsPage').on('click', function() {
        chrome.runtime.openOptionsPage()
    });

    chrome.runtime.sendMessage({request : 'wakeup'});

    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name === 'initAlarm') {
            chrome.storage.local.get(['popupRefreshTime', 'cacheData', 'fetchDataDate', 'scheduleRefreshTime', 'schedule'], function(data) {
                var popupTime = data && data.popupRefreshTime ? data.popupRefreshTime : 0
                var scheduleTime = data && data.scheduleTime ? data.scheduleTime : 0
                var d = new Date()
                DATE_UTILS.fetchDataDate = data.fetchDataDate
                if (DATE_UTILS.needNewSchedule(data.cacheData, d)) {
                    updateLastUpdate(d)
                    DATE_UTILS.schedule = data.schedule
                    updateCards(DATE_UTILS.searchGames(d))
                } else if (d.getTime() - popupTime > 60000) {
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

                if (d.getTime() - scheduleTime > 86400) {
                    fetchFullSchedule()
                }
            });
        }
    });

    chrome.alarms.create('initAlarm', {
        when : new Date().getTime() + 200
    });
});