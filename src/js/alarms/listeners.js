'use strict';

// Config the live game badge
chrome.alarms.onAlarm.addListener(function(alarm){
    if (alarm.name === 'liveAlarm') {
        const callBack = function(data) {
            if (data && !data.failed) {
                let isLive = false
                data.gs.g.forEach(function(match){
                    isLive = validateLiveGame(match) === 'live' || isLive
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
})
