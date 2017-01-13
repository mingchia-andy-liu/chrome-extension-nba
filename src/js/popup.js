$(function(){
    'use strict';

    $('body').on('click', '.' + UTILS.CARD + ':not(.no-game)', function(){
        let hashedUrl = 'box-score.html#' + $(this).attr('gid');
        chrome.tabs.create({url: hashedUrl});
    });

    chrome.alarms.create('initAlarm', {
        when : new Date().getTime() + 200
    });

    chrome.alarms.onAlarm.addListener(function(alarm){
        console.log(alarm.name);
        if (alarm.name === 'initAlarm') {
            chrome.storage.local.get(['popupRefreshTime', 'cacheData'], function(data) {
                if (!data.popupRefreshTime) {
                    fetchData();
                } else {
                    var d = new Date();
                    var diff = (d.getTime() - data.popupRefreshTime);
                    if (diff > 60000) {
                        fetchData();
                    } else {
                        updateLastUpdate(data.popupRefreshTime);
                        $("div").remove("." + UTILS.CARD);
                        for (var key in data.cacheData) {
                            var obj = data.cacheData[key];
                            $("#cards").append($(obj.card).attr('gid', obj.gid));
                        }
                    }
                }
            });
        }
    });
});