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

// chrome.notifications.onClicked.addListener(function(notificationId) {
//     if (notificationId) {
//         chrome.tabs.create({'url': "/box-score.html" })
//     }
// })

// chrome.runtime.onSuspend.addListener(function() {
//     chrome.storage.local.set({
//         boxScore: null
//     })
// })

chrome.alarms.create('minuteAlarm', {
    delayInMinutes : 1,
    periodInMinutes : 1
});

chrome.alarms.create('scheduleAlarm', {
    delayInMinutes : 60, // start time right away
    periodInMinutes : 60   // periodical time
});

chrome.alarms.create('liveAlarm', {
    delayInMinutes : 1, // start time
    periodInMinutes : 1   // periodical time
});


/**
 * Sends a notification if the favourite team is on
 * @param {array} games array of games from the API endpoint
 */
function checkFavTeamOn(games) {
    chrome.storage.local.get(['favTeamStatus'], function(data) {
        console.log(data.favTeamStatus)
        if (data && data.favTeamStatus) {
            const favTeamStatus = data.favTeamStatus
            games.forEach(function(game){
                if (favTeamStatus[game.v.ta] || favTeamStatus[game.h.ta]) {
                    /**
                     * notification status
                     *  @property {int}
                     *      1: just reset
                     *      2: shown the start
                     *      3: shown the final
                     */
                    if (game._status === 'live' && (favTeamStatus[game.v.ta] < 2 || favTeamStatus[game.h.ta] < 2)) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: '/src/assets/png/icon-color-128.png',
                            message: `${game.h.tn} vs ${game.v.tn} has started.`,
                            title: 'Game started',
                        })
                        if (favTeamStatus[game.v.ta]) {
                            favTeamStatus[game.v.ta] = 2
                        }
                        if (favTeamStatus[game.h.ta]) {
                            favTeamStatus[game.h.ta] = 2
                        }
                        chrome.storage.local.set({
                            favTeamStatus: favTeamStatus
                        })
                    } else if (game._status === 'finish' && (favTeamStatus[game.v.ta] < 3 || favTeamStatus[game.h.ta] < 3)) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: '/src/assets/png/icon-color-128.png',
                            message: `${game.h.tn} vs ${game.v.tn} has finished.`,
                            title: 'Game finished',
                        })
                        if (favTeamStatus[game.v.ta]) {
                            favTeamStatus[game.v.ta] = 3
                        }
                        if (favTeamStatus[game.h.ta]) {
                            favTeamStatus[game.h.ta] = 3
                        }
                        chrome.storage.local.set({
                            favTeamStatus: favTeamStatus
                        })
                    } else if (game._status === 'prepare' && (favTeamStatus[game.v.ta] === 3 || favTeamStatus[game.h.ta] === 3)) {
                        if (favTeamStatus[game.v.ta]) {
                            favTeamStatus[game.v.ta] = 1
                        }
                        if (favTeamStatus[game.h.ta]) {
                            favTeamStatus[game.h.ta] = 1
                        }
                        chrome.storage.local.set({
                            favTeamStatus: favTeamStatus
                        })
                    }
                }
            })
        }
    })
}

// Config the live game badge
chrome.alarms.onAlarm.addListener(function(alarm){
    if (alarm.name === 'liveAlarm') {
        console.log(new Date())
        const callBack = function(data) {
            if (data && !data.failed) {
                let isLive = false
                data.gs.g.forEach(function(match){
                    isLive = validateLiveGame(match) === 'live' || isLive
                })
                const badgeText = isLive ? 'live' : ''
                chrome.browserAction.setBadgeText({text: badgeText})
                chrome.browserAction.setBadgeBackgroundColor({color: '#FC0D1B'})
                if (isLive) {
                    checkFavTeamOn(data.gs.g)
                }
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
    const gameCallBack = function(data) {
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
    fetchGames(gameCallBack)
    const scheduleCallBack = function(data) {
        if (data && !data.failed) {
            chrome.storage.local.set({
                'schedule' : data,
                'scheduleRefreshTime' : new Date().getTime()
            })
        }
    }
    fetchFullSchedule(scheduleCallBack)
})()
