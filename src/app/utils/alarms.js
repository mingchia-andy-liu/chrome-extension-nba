import moment from 'moment-timezone'
import browser from './browser'
import { store } from '../store'
import { fetchLiveGameBoxIfNeeded } from '../containers/BoxScoresDetails/actions'
import { fetchGamesIfNeeded } from '../containers/Popup/actions'
import { DATE_FORMAT } from '../utils/constant'

browser.alarms.create('minute', {
    when: moment().add(1, 'minute').second(0).valueOf(),
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
