'use strict';

const STATUS_RESET = { ATL : 1, BKN : 1, BOS : 1, CHA : 1, CHI : 1, CLE : 1, DAL : 1, DEN : 1, DET : 1, GSW : 1, HOU : 1, IND : 1, LAC : 1, LAL : 1, MEM : 1, MIA : 1, MIL : 1, MIN : 1, NOP : 1, NYK : 1, OKC : 1, ORL : 1, PHI : 1, PHX : 1, POR : 1, SAC : 1, SAS : 1, TOR : 1, UTA : 1, WAS : 1
}


/**
 * Helper of removing duplicates in an array
 * @param {*} value
 * @param {*} index
 * @param {*} self
 */
function uniqueOnly(value, index, self) {
    return self.indexOf(value) === index
}

/**
 * Sends a notification if the favourite team is OFF and RESET
 * @param {array} games array of games from the API endpoint
 */
function checkFavTeamOn(games) {
    chrome.storage.local.get(['favTeamStatus'], function(data) {
        if (data && data.favTeamStatus) {
            const favTeamStatus = data.favTeamStatus
            games.forEach(function(game) {
                if (favTeamStatus[game.v.ta] || favTeamStatus[game.h.ta]) {
                    /**
                     * notification status
                     *  @property {int}
                     *      1: just reset
                     *      2: shown the start
                     *      3: shown the final
                     */
                    if (game._status === 'finish' && (favTeamStatus[game.v.ta] < 3 || favTeamStatus[game.h.ta] < 3)) {
                        chrome.notifications.create(game.gid, {
                            type: 'basic',
                            iconUrl: '/src/assets/png/icon-color-128.png',
                            message: `${game.v.tn} ${game.v.s} vs ${game.h.s} ${game.h.tn} has finished.`,
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
                    }
                    // else if (game._status === 'prepare' && (favTeamStatus[game.v.ta] === 3 || favTeamStatus[game.h.ta] === 3)) {
                    //     if (favTeamStatus[game.v.ta]) {
                    //         favTeamStatus[game.v.ta] = 1
                    //     }
                    //     if (favTeamStatus[game.h.ta]) {
                    //         favTeamStatus[game.h.ta] = 1
                    //     }
                    //     chrome.storage.local.set({
                    //         favTeamStatus: favTeamStatus
                    //     })
                    // }
                }
            })
        }
    })
}

function matchNotification(scheduledTime) {
    const games = DATE_UTILS.searchGames(new Date())
    const times = games.map(function(game) {
        return moment(getGameStartTime(game.stt, game.gcode), "h:mm A").valueOf()
    })
    const notifiedGames = []
    debugger
    const indexes = times.map(function(time, index) {
        if (time === scheduledTime) {
            notifiedGames.push(games[index])
        }
    })
    debugger
    chrome.storage.local.get(['favTeamStatus'], function(data) {
        if (data && data.favTeamStatus) {
            const favTeamStatus = data.favTeamStatus
            debugger
            notifiedGames.forEach(function(game) {
                debugger
                if (favTeamStatus[game.v.ta] || favTeamStatus[game.h.ta]) {
                    /**
                     * notification status
                     *  @property {int} 1: just reset 2: shown the start 3: shown the final
                     */
                    // if (game._status === 'live' && (favTeamStatus[game.v.ta] < 2 || favTeamStatus[game.h.ta] < 2)) {
                    if (favTeamStatus[game.v.ta] < 2 || favTeamStatus[game.h.ta] < 2) {
                        chrome.notifications.create(game.gid, {
                            type: 'basic',
                            iconUrl: '/src/assets/png/icon-color-128.png',
                            message: `${game.v.tn} vs ${game.h.tn} is starting soon.`,
                            title: 'Game starting soon',
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
                    }
                }
            })
        }
    })
}

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
                // console.log(`isLive is ${isLive}`)
                // if (isLive) {
                //     checkFavTeamOn(data.gs.g)
                // }
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
    } else if (alarm.name === 'notificationSetUpAlarm') {
        chrome.storage.local.get(['favTeamStatus'], function(data) {
            const games = DATE_UTILS.searchGames(new Date())
            const times = games.map(function(game) {
                return getGameStartTime(game.stt, game.gcode)
            })
            const notiTimes = times.filter(uniqueOnly)
            notiTimes.forEach(function(time) {
                chrome.alarms.create(`notificationAlarm${time}`, {
                    when : moment(time, "h:mm A").valueOf()
                })
            })
        })

        // reset everynight
        chrome.storage.local.set({
            favTeamStatus: STATUS_RESET
        })
    } else if (alarm.name.includes('notificationAlarm')) {
        matchNotification(alarm.scheduledTime)
    }
})

chrome.notifications.onClicked.addListener(function(notificationId) {
    if (notificationId) {
        chrome.notifications.clear(notificationId)
        chrome.tabs.create({ 'url': `/box-score.html#${notificationId}` })
    }
})
