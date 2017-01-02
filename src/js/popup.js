$(function(){
    'use strict';

    var extId = chrome.runtime.id;
    $('body').on('click', 'a', function(){
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            var notOpened = true;
            for (let index in tabs) {
                if (tabs[index].url === "chrome-extension://" + extId + "/box-score.html") {
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