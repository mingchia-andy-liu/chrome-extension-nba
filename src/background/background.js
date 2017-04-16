$(function () {
    'use strict';

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.request === 'summary') {
            fetchGames(sendResponse);
        } else if (request.request === 'box_score') {
            fetchLiveGameBox(sendResponse, request.gid);
        } else if (request.request === 'schedule') {
            fetchFullSchedule(sendResponse)
        } else if (request.request === 'wakeup') {
            sendResponse('woken');
        }

        return true;        // return true to tell google to use sendResponse asynchronously
    });

    // this will reload the background explicitly to trigger an update as soon as possible if available
    chrome.runtime.onUpdateAvailable.addListener(function(details){
        console.log("updating to version " + details.version);
        chrome.runtime.reload();
    });

    chrome.alarms.create('minuteAlarm', {
        delayInMinutes : 1,
        periodInMinutes : 1
    });

    chrome.alarms.create('scheduleAlarm', {
        delayInMinutes : 120,
        periodInMinutes : 120
    })

    function fetchGames(sendResponse) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2016/scores/00_todays_scores.json'
        }).done(function(data) {
            console.log(data);
            sendResponse(data);
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
            sendResponse({failed :true});
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

    function fetchFullSchedule(sendResponse) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/league/00_full_schedule.json'
        }).done(function(data){
            sendResponse(data);
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
            sendResponse({failed: true});
        });
    }
});
