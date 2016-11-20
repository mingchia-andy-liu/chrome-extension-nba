$(function(){
    'use strict';

    var CARD = "c-card";
    // use to create new tab
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')}, function(tab) {
            console.log(tab.id);
            chrome.runtime.sendMessage(tab.id, {gameID: '123'});
        });
    });

    // chrome.storage.sync.clear(function (){});


    chrome.storage.local.get(['popupRefreshTime', 'cacheData'], function(data) {
        if (!data.popupRefreshTime) {
            fetchData();
        } else {
            var d = new Date();
            var diff = (d.getTime() - data.popupRefreshTime);
            if (diff > 5000) {
                fetchData();
            } else {
                $("#lastUpdate").text("Last fetched: " + diff + " seconds ago");
                $("div").remove("." + CARD);
                for (var key in data.cacheData) {
                    var obj = data.cacheData[key];
                    $("#cards").append(obj);
                }
            }
        }
    });

    function fetchData() {
        // TODO: change the request object and fetch static data
        chrome.runtime.sendMessage({request : 'box_score'}, function (response) {
            if (response) {
                // too big for sync, it only allows 8 bytes per item
                // sync also make the popup window weird
                chrome.storage.local.set({
                    'popupRefreshTime' : new Date().getTime(),
                    'cacheData' : response.games
                });

                $("#lastUpdate").text("Last fetched: 0 seconds ago");
                $("div").remove("." + CARD);
                for (var key in response.games) {
                    var obj = response.games[key];
                    $("#cards").append(obj);
                }
            }
        });
    }
});