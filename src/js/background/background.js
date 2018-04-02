'use strict';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.request === 'summary') {
        fetchGames(sendResponse);
    } else if (request.request === 'box_score') {
        fetchLiveGameBox(sendResponse, request.gid);
    } else if (request.request === 'pbp') {
        fetchPlayByPlay(sendResponse, request.gid)
    } else if (request.request === 'wakeup') {
        sendResponse('woken');
    }

    return true;        // return true to tell broswer to use sendResponse asynchronously
});

// this will reload the background explicitly to trigger an update as soon as possible if available
chrome.runtime.onUpdateAvailable.addListener(function(details){
    console.log("updating to version " + details.version);
    chrome.runtime.reload();
});

/**
 * Add a listener for loading up the changelog on Major/Minor update, not patches.
 */
chrome.runtime.onInstalled.addListener(function(details) {
    const currentVersion = chrome.runtime.getManifest().version
    const previousVersion = details.previousVersion
    if (details.reason === 'update') {
        // only open the options page iff it's major and minor updates
        const currentSplit = currentVersion.split('.')
        const previousSplit = previousVersion.split('.')
        if (currentSplit[0] !== previousSplit[0] ||
            currentSplit[1] !== previousSplit[1]) {
            chrome.tabs.create({ 'url': "/changelog.html" })
        }
    }
});

function fetchGames(sendResponse) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: 'https://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json'
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
        url: `https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/scores/gamedetail/${gid}_gamedetail.json`
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
        url: 'https://data.nba.com/data/v2015/json/mobile_teams/nba/2017/league/00_full_schedule_week.json'
    }).done(function(data){
        sendResponse(data.lscd);
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log('Failed to fetch data.');
        sendResponse({failed: true});
    });
}

function fetchPlayByPlay(sendResponse, gid) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: `https://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/pbp/${gid}_full_pbp.json`
    }).done(function(data){
        sendResponse(data);
    }).fail(function(xhr, textStatus, errorThrown) {
        console.log('Failed to fetch data.');
        sendResponse({failed: true});
    });
}

(function initFetch() {
    const gameCallBack = function(data) {
        if (data && !data.failed) {
            const isLive = data.gs.g.find(function(match){
                return validateLiveGame(match) === 'live'
            })
            setLiveBadge(isLive)

            chrome.storage.local.set({
                'popupRefreshTime' : 0,
                'cacheData' : data.gs.g,
                'fetchDataDate' : data.gs.gdte
            })
        }
    }
    fetchGames(gameCallBack)
    const scheduleCallBack = function(data) {
        if (data && !data.failed) {
            DATE_UTILS.setSchedule(data)
            chrome.storage.local.set({
                'schedule' : data
            })
        }
    }
    fetchFullSchedule(scheduleCallBack)
})()
