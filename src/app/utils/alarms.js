import moment from 'moment-timezone'
import browser from './browser'
import {store} from '../store'
import getAPIDate from './getApiDate'
import { fetchRequest as fetchBSRequest } from '../containers/BoxScores/actions'
import { fetchRequest as fetchGamesRequest } from '../containers/Popup/actions'

browser.alarms.create('minute', {
    delayInMinutes: 1,
    periodInMinutes: 1,
})

browser.alarms.create('live', {
    when: Date.now(),
    periodInMinutes: 30,
})

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'live') {
        fetchGamesRequest(getAPIDate().format('YYYYMMDD')).then(games => {
            const hasLiveGame = games.find(game => game.period_time && game.period_time.game_status === '2')
            if (hasLiveGame) {
                browser.setBadgeText({ text: 'live' })
                browser.setBadgeBackgroundColor({ color: '#FC0D1B' })
            } else {
                browser.setBadgeText({ text: '' })
            }
        })
    } else if (alarm.name === 'minute') {
        const { bs, date: {date}} = store.getState()
        const dateStr = moment(date).format('YYYYMMDD')
        fetchGamesRequest(dateStr)
        if (bs && bs.gid !== '') {
            fetchBSRequest(dateStr, bs.gid)
        }
    }
})
