$(function () {
    'use strict';

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.request === 'summary') {
            fetchData(sendResponse);
        } else if (request.request === 'box_score') {
            fetchLiveGameBox(sendResponse, request.gid);
        }

        return true;        // return true to tell google to use sendResponse asynchronously
    });

    chrome.alarms.create('minuteAlarm', {
        delayInMinutes : 1,
        periodInMinutes : 1
    });

    function fetchData(sendResponse) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2016/scores/00_todays_scores.json'
        }).done(function(data) {
            sendResponse(data);
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
            sendResponse(null);
        });
    }

    function fetchLiveGameBox(sendResponse, gid) {
        $.ajax({
            type: 'GET',
            contentType:'application/json',
            url: 'http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/scores/gamedetail/' + gid + '_gamedetail.json'
        }).done(function(data){
            sendResponse(data);
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
            sendResponse(null);
        });
    }
});
