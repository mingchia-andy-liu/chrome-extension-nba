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
                    games[0] = NO_GAME_CARD;
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
            } else {
                console.log('data is empty');
            }
        });
    }
});

// $(function(){"use strict";function a(){chrome.runtime.sendMessage({request:"summary"},function(a){if(a){var b=[];if(0===a.gs.g.length)b[0]=NO_GAME_CARD;else for(var c=0;c<a.gs.g.length;c++){var d=a.gs.g[c],e=formatCard(d);validateLiveGame(d)?b.unshift(e):b[c]=e}chrome.storage.local.set({popupRefreshTime:(new Date).getTime(),cacheData:b}),$("#lastUpdate").text("Last fetched: 0 seconds ago"),$("div").remove("."+UTILS.CARD);for(var f in b){var g=b[f];$("#cards").append(g)}}else console.log("data is empty")})}$("body").on("click","a",function(){chrome.tabs.create({url:$(this).attr("href")})}),chrome.storage.local.get(["popupRefreshTime","cacheData"],function(b){if(b.popupRefreshTime){var c=new Date,d=c.getTime()-b.popupRefreshTime;if(d>6e4)a();else{$("#lastUpdate").text("Last fetched: "+(d/1e3).toFixed()+" seconds ago"),$("div").remove("."+UTILS.CARD);for(var e in b.cacheData){var f=b.cacheData[e];$("#cards").append(f.card)}}}else a()})});