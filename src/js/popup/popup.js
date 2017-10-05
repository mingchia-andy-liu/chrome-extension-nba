$(function(){
    'use strict';

    $('body').on('click', '.' + UTILS.CARD + ':not(.no-game)', function(){
        let hashedUrl = 'box-score.html#' + $(this).attr('gid');
        chrome.tabs.create({url: hashedUrl});
    });

    $('#boxScorePage').on('click', function() {
        chrome.tabs.create({'url': "/box-score.html" } )
    });

    $('#optionsPage').on('click', function() {
        chrome.tabs.create({'url': "/options.html" } )
    });

    chrome.runtime.sendMessage({request : 'wakeup'});

    chrome.alarms.onAlarm.addListener(function(alarm){
        if (alarm.name === 'initAlarm') {
            chrome.storage.local.get(['popupRefreshTime', 'cacheData', 'scheduleRefreshTime', 'schedule'], function(data) {
                var popupTime = data && data.popupRefreshTime ? data.popupRefreshTime : 0;
                var scheduleTime = data && data.scheduleTime ? data.scheduleTime : 0
                var d = new Date();
                if (d.getTime() - popupTime > 60000) {
                    fetchData()
                    .fail(function(){
                        updateLastUpdate(data.popupRefreshTime);
                        $('.no-game').removeClass('u-hide').text(FETCH_DATA_FAILED);
                    });
                } else {
                    updateLastUpdate(data.popupRefreshTime);
                    updateCards(data.cacheData);
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