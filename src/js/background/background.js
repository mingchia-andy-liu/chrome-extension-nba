'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.request === 'summary') {
        fetchGames(sendResponse);
    } else if (request.request === 'box_score') {
        fetchLiveGameBox(sendResponse, request.gid);
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
    const currentVersion = chrome.runtime.getManifest().version
    const previousVersion = details.previousVersion
    if (details.reason === 'update') {
        // only open the options page iff it's major and minor updates
        const currentSplit = currentVersion.split('.')
        const previousSplit = previousVersion.split('.')
        if (currentSplit[0] !== previousSplit[0] ||
            currentSplit[1] !== previousSplit[1]) {
            chrome.runtime.openOptionsPage()
        }
    }
});

chrome.alarms.create('minuteAlarm', {
    delayInMinutes : 1,
    periodInMinutes : 1
});

// TODO: alarm won't get fired after like 5 seconds of inactive
// because background page gets unloaded
chrome.alarms.create('scheduleAlarm', {
    delayInMinutes : 1, // start time rigth away
    periodInMinutes : 60   // periodical time
});

const liveCallBack = function() {
    const callBack = function(data) {
        if (data && !data.failed) {
            const isLive = data.gs.g.find(function(match){
                return validateLiveGame(match) === 'live'
            })
            const badgeText = isLive ? 'live' : ''
            chrome.browserAction.setBadgeText({text: badgeText})
            chrome.browserAction.setBadgeBackgroundColor({color: '#FC0D1B'})
        } else {
            chrome.browserAction.setBadgeText({text: ''})
        }
    }
    fetchGames(callBack)
}
const liveAlarmId = setInterval(liveCallBack, 30 * 60 * 1000)

function validateLiveGame(match) {
    if (match.stt === 'Final') {
        //finish
        match._status = 'finish'
        return 'finish'
    } else if (match && !match.cl) {
        // haven't started
        match._status = 'prepare'
        return 'prepare'
    } else if (match.stt === 'Halftime' || match.stt.includes('End') || match.stt.includes('Start')) {
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
        const callBack = function(data) {
            if (data && !data.failed) {
                const isLive = data.gs.g.find(function(match){
                    return validateLiveGame(match) === 'live'
                })
                const badgeText = isLive ? 'live' : ''
                chrome.browserAction.setBadgeText({text: badgeText})
                chrome.browserAction.setBadgeBackgroundColor({color: '#FC0D1B'})
            }
        }
        fetchGames(callBack)
    } else if (alarm.name === 'scheduleAlarm') {
        const callBack = function(data) {
            if (data && !data.failed) {
                chrome.storage.local.set({
                    'schedule' : data,
                    'scheduleRefreshTime' : new Date().getTime()
                })
            }
        }
        fetchFullSchedule(callBack)
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
    const callBack = function(data) {
        if (data && !data.failed) {
            const isLive = data.gs.g.find(function(match){
                return validateLiveGame(match) === 'live'
            })
            const badgeText = isLive ? 'live' : ''
            chrome.browserAction.setBadgeText({text: badgeText})
            chrome.browserAction.setBadgeBackgroundColor({color: '#FC0D1B'})

            chrome.storage.local.set({
                'popupRefreshTime' : 0,
                'cacheData' : data.gs.g,
                'fetchDataDate' : data.gs.gdte
            })
        }
    }
    fetchGames(callBack)
})()
