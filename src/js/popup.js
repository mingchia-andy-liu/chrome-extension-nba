$(function(){
    'use strict';

    var EXT_ID = chrome.runtime.id;
    $('body').on('click', 'a', function(){
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            var notOpened = true;
            for (let index in tabs) {
                if (tabs[index].url === "chrome-extension://" + EXT_ID + "/box-score.html") {
                    //your popup is alive
                    notOpened = false;
                    chrome.tabs.update(tabs[index].id, {active: true}); //focus it
                    break;
                }
            }
            if (notOpened) { //it didn't found anything, so create it
                chrome.tabs.create({url: 'box-score.html'});
            }
            window.close();
        });
    });

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