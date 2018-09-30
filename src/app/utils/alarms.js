import moment from 'moment-timezone'
import browser from './browser'
import {store} from '../store'
import { fetchLiveGameBoxIfNeeded } from '../containers/BoxScores/actions'
import { fetchGamesIfNeeded } from '../containers/Popup/actions'
import { DATE_FORMAT } from '../utils/format'

browser.alarms.create('minute', {
    delayInMinutes: 1,
    periodInMinutes: 1,
})

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'minute') {
        const { bs, date: {date}} = store.getState()
        const dateStr = moment(date).format(DATE_FORMAT)
        fetchGamesIfNeeded(dateStr)(store.dispatch, store.getState)
        if (bs && bs.gid !== '') {
            fetchLiveGameBoxIfNeeded(dateStr, bs.gid)(store.dispatch, store.getState)
        }
    }
})
