import moment from 'moment-timezone'
import browser from './browser'
import {store} from '../store'
import { fetchLiveGameBoxIfNeeded } from '../containers/BoxScores/actions'
import { fetchGamesIfNeeded } from '../containers/Popup/actions'

browser.alarms.create('minute', {
    delayInMinutes: 1,
    periodInMinutes: 1,
})

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'minute') {
        const { bs, date: {date}} = store.getState()
        const dateStr = moment(date).format('YYYYMMDD')
        fetchGamesIfNeeded(dateStr)(store.dispatch)
        if (bs && bs.gid !== '') {
            fetchLiveGameBoxIfNeeded(dateStr, bs.gid)(store.dispatch)
        }
    }
})
