$(function(){
    'use strict';

    $('body').on('click', '.' + UTILS.CARD + ':not(.no-game)', function(){
        let hashedUrl = 'box-score.html#' + $(this).attr('gid');
        chrome.tabs.create({url: hashedUrl});
    });

    chrome.alarms.onAlarm.addListener(function(alarm){
        if (alarm.name === 'initAlarm') {
            chrome.storage.local.get(['popupRefreshTime', 'cacheData'], function(data) {
                var cacheDate = data && data.popupRefreshTime ? data.popupRefreshTime : 0;
                var d = new Date();
                if (d.getTime() - cacheDate > 60000) {
                    fetchData()
                    .fail(function(){
                        updateLastUpdate(data.popupRefreshTime);
                        $('.no-game').removeClass('u-hide').text(FETCH_DATA_FAILED);
                    });
                } else {
                    updateLastUpdate(data.popupRefreshTime);
                    updateCards(data.cacheData);
                }
            });
        }
    });

    $('.c-card').each(function(){
        $(this).tooltip({
          track: true,
          // /* work around https://bugs.jqueryui.com/ticket/10689 */
          create: function () { $(".ui-helper-hidden-accessible").remove(); }
        });
    });

    chrome.alarms.create('initAlarm', {
        when : new Date().getTime() + 100
    });
});