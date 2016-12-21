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
                $("#lastUpdate").text("Last fetched: " + (diff/1000).toFixed() + " seconds ago");
                $("div").remove("." + UTILS.CARD);
                for (var key in data.cacheData) {
                    var obj = data.cacheData[key];
                    $("#cards").append(obj.card);
                }
            }
        }
    });

    function fetchData() {
        chrome.runtime.sendMessage({request : 'summary'}, function (data) {
            if (data) {
                var games = [];
                if (data.gs.g.length === 0) {
                    games[0] = formatTag('There is no game today. Try again tomorrow!', 'div', [UTILS.CARD, UTILS.SHADOW]);
                } else {
                    for (var i = 0; i < data.gs.g.length; i++){
                        var game = data.gs.g[i];
                        var card = formatCard(game);
                        if (validateLiveGame(game)) {
                            games.unshift(card);
                        } else {
                            games[i] = card;
                        }
                     }
                }

                // too big for sync, it only allows 8 bytes per item
                // sync also make the popup window weird
                chrome.storage.local.set({
                    'popupRefreshTime' : new Date().getTime(),
                    'cacheData' : games
                });

                $("#lastUpdate").text("Last fetched: 0 seconds ago");
                $("div").remove("." + UTILS.CARD);
                for (var key in games) {
                    var obj = games[key];
                    $("#cards").append(obj);
                }
            }
        });
    }
});