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

chrome.runtime.onInstalled.addListener(function(details) {
    console.log('installed')
    chrome.runtime.openOptionsPage()
});

chrome.alarms.create('minuteAlarm', {
    delayInMinutes : 1,
    periodInMinutes : 1
});

chrome.alarms.create('scheduleAlarm', {
    delayInMinutes : 1, // start time
    periodInMinutes : 720   // periodical time
});

chrome.alarms.create('liveAlarm', {
    delayInMinutes : 1, // start time
    periodInMinutes : 30   // periodical time
});

function validateLiveGame(match) {
    if (match.stt === 'Final') {
        //finish
        match._status = 'finish'
        return 'finish'
    } else if (match && !match.cl) {
        // haven't started
        match._status = 'prepare'
        return 'prepare'
    } else if (match.stt === 'Halftime' || match.stt.includes('End')) {
        // live
        match._status = 'live'
        return 'live'
    } else if (match.cl === '00:00.0') {
        if (match.stt.includes('ET') || match.stt.includes('pm') || match.stt.includes('am') || match.stt === 'PPD') {
            match._status = 'prepare'
            return 'prepare'
        }
    } else if (match.cl !== '' && match.cl !== '00:00.0') {
        match._status = 'live'
        return 'live'
    }
    match._status = 'prepare'
    return 'prepare'
}

// Config the live game badge
chrome.alarms.onAlarm.addListener(function(alarm){
    if (alarm.name === 'liveAlarm') {
        console.log('sdfsdf')
        const callBack = function(data) {
            if (data && !data.failed) {
                const isLive = data.gs.g.find(function(match){
                    return validateLiveGame(match) === 'live'
                })
                const badgetText = isLive ? 'live' : ''
                chrome.browserAction.setBadgeText({text: badgetText})
                chrome.browserAction.setBadgeBackgroundColor({color: '#FC0D1B'})
            } else {
                chrome.browserAction.setBadgeText({text: ''})
            }
        }
        fetchGames(callBack)
    }
});

function fetchGames(sendResponse) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json'
    }).done(function(data) {
        sendResponse(data);
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log('Failed to fetch data.');
        sendResponse({failed :true});
    });
}

function fetchLiveGameBox(sendResponse, gid) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: `http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/scores/gamedetail/${gid}_gamedetail.json`
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
        url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/league/00_full_schedule_week.json'
    }).done(function(data){
        sendResponse(data.lscd);
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log('Failed to fetch data.');
        sendResponse({failed: true});
    });
}

(function initFetch() {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json'
    }).done(function(data) {
        chrome.storage.local.set({
            'popupRefreshTime' : 0,
            'cacheData' : data.gs.g,
            'fetchDataDate' : data.gs.gdte
        })
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log('Failed to fetch data.');
    })
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/league/00_full_schedule_week.json'
    }).done(function(data){
        chrome.storage.local.set({
            'schedule' : data.lscd,
            'scheduleRefreshTime' : 0
        })
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log('Failed to fetch data.');
    });
})()
