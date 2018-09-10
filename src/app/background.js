import moment from 'moment-timezone'
import browser from './utils/browser'

// tracks any live game in the background
browser.alarms.create('live', {
    delayInMinutes: 0.1,
    periodInMinutes: 30,
})

const getAPIDate = () => {
    const ET = moment.tz(moment(), 'America/New_York')
    const EThour = moment(ET).format('HH')
    // if ET time has not pass 6 am, don't jump ahead
    if (+EThour < 6) {
        return moment(ET).subtract(1, 'day')
    }
    return ET
}

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'live') {
        const dateStr = getAPIDate().format('YYYYMMDD')
        fetch(`https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`)
            .then(res => res.json())
            .then(data => {
                const { sports_content: { games: { game: live } } } = data
                const hasLiveGame = live.find(game =>
                    game.period_time && game.period_time.game_status === '2'
                )
                if (hasLiveGame) {
                    browser.setBadgeText({ text: 'live' })
                    browser.setBadgeBackgroundColor({ color: '#FC0D1B' })
                } else {
                    browser.setBadgeText({ text: '' })
                }
            })
            .catch(() => browser.setBadgeText({ text: '' }))
    }
})

// this will reload the background explicitly to trigger an update as soon as possible if available
browser.runtime.onUpdateAvailable.addListener(() => {
    browser.runtime.reload()
})

// Add a listener for loading up the changelog on Major/Minor update, not patches.
browser.runtime.onInstalled.addListener((details) => {
    const currentVersion = browser.runtime.getManifest().version
    const previousVersion = details.previousVersion
    if (details.reason === 'update') {
        // only open the options page iff it's major and minor updates
        const currentSplit = currentVersion.split('.')
        const previousSplit = previousVersion.split('.')
        if (currentSplit[0] !== previousSplit[0] || currentSplit[1] !== previousSplit[1]) {
            browser.tabs.create({ url: '/index.html#/changelog' })
        }
    }
})
