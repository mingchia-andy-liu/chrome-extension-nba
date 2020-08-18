import addMinutes from 'date-fns/addMinutes'
import setSeconds from 'date-fns/setSeconds'
import format from 'date-fns/format'
import browser from './browser'
import { store } from '../store'
import { fetchLiveGameBoxIfNeeded } from '../containers/BoxScoresDetails/actions'
import { fetchGamesIfNeeded, fetchGameHighlightIfNeeded } from '../containers/Popup/actions'
import { DATE_FORMAT } from '../utils/constant'

browser.alarms.create('minute', {
  when: setSeconds(addMinutes(Date.now(), 1), 0).valueOf(),
  periodInMinutes: 1,
})

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'minute') {
    const {
      bs,
      date: { date },
    } = store.getState()

    const dateStr = format(date, DATE_FORMAT)
    fetchGamesIfNeeded(dateStr)(store.dispatch, store.getState).then(() => {
      fetchGameHighlightIfNeeded()(store.dispatch, store.getState)
    })
    if (bs && bs.gid !== '') {
      fetchLiveGameBoxIfNeeded(dateStr, bs.gid)(
        store.dispatch,
        store.getState
      )
    }
  }
})
