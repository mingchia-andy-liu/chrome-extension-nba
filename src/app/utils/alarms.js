import moment from 'moment-timezone'
import browser from './browser'
import { getStore } from '../store'
import { fetchLiveGameBoxIfNeeded } from '../containers/BoxScores/actions'
import { fetchGamesIfNeeded } from '../containers/Popup/actions'
import { DATE_FORMAT } from '../utils/constant'

browser.alarms.create('minute', {
    when: moment().add(1, 'minute').second(0).valueOf(),
    periodInMinutes: 1,
})

browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'minute') {
        const store = await getStore()
        const { bs, date: {date}} = store.getState()
        const dateStr = moment(date).format(DATE_FORMAT)
        fetchGamesIfNeeded(dateStr)(store.dispatch, store.getState)
        if (bs && bs.gid !== '') {
            fetchLiveGameBoxIfNeeded(dateStr, bs.gid)(store.dispatch, store.getState)
        }
    }
})
