$(function(){
    'use strict';

    var CARD = "c-card";

    function fetchData() {
        // TODO: change the request object and fetch static data
        chrome.runtime.sendMessage({request : 'box_score'}, function (response) {
            if (response) {
                $("div").remove("." + CARD);
                for (var key in response.games) {
                    var obj = response.games[key];
                    $("#box_score").append(obj);
                }
            }
        });
    }

    // use to create new tab
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
    });

    fetchData();
});