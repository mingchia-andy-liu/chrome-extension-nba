$(function(){
    'use strict';

    var SHADOW = "u-shadow";

    // TODO: Long-live-connection
    // var port = chrome.runtime.connect({name:"mycontentscript"});
    // port.onMessage.addListener(function(message,sender){
    //     if(message.greeting === "hello"){
    //         alert(message.greeting);
    //     }
    // });

    function fetchData() {
        // TODO: change the request object
        chrome.runtime.sendMessage({request : 'box_score'}, function (response) {
            if (response) {
                $("div").remove("." + SHADOW);
                for (var key in response.games) {
                    var obj = response.games[key];
                    $("#box_score").append(obj);
                }
            }
        });
    }

    function refresh(){
        // best practice to use setTimeout instead of setInterval
        // TODO: USE chrome.runtime.alarm
        var d = new Date();
        var datetext = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        $("#timer").text("Last updated: " + datetext);
        fetchData();
        setTimeout(refresh, 60000);
    }
    refresh();
});