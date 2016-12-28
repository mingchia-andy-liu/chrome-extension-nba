$(function(){
    'use strict';

    // use to create new tab
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
    });

    // chrome.storage.sync.clear(function (){});

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
                    $("#cards").append(obj.card);
                }
            }
        }
    });
});