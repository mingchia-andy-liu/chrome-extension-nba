$(function(){
    'use strict';

    setTimeout(function() {}, 1000);

    $('body').on('click', '.' + UTILS.CARD, function(){
        let hashedUrl = 'box-score.html#' + $(this).attr('gid');
        chrome.tabs.create({url: hashedUrl});
    });

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
});