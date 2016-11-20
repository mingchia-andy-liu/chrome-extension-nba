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

    $('#table').addClass('u-display-flex');

    function fetchData() {
        // TODO: change the request object
        chrome.runtime.sendMessage({request : 'box_score'}, function (response) {
            if (response) {
                var d = new Date();
                var datetext = d.getHours() + ":" + d.getMinutes();
                $("#timer").text("Last updated: " + datetext);
                $("div").remove("." + "c-card");
                for (var key in response.games) {
                    var obj = response.games[key];
                    $("#cards").append(obj);
                }
            }
        });
    }

    // alarm better than timeout
    chrome.alarms.onAlarm.addListener(function(alarm){
        if (alarm.name === 'minuteAlarm') {
            fetchData();
        }
    });

    fetchData();    // inital fetch
});