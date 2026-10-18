import format from 'date-fns/format'
import browser from './browser'
import { store } from '../store'
import { fetchLiveGameBoxIfNeeded } from '../containers/BoxScoresDetails/boxScoresDetailsSlice'
import {
  fetchGamesIfNeeded,
  fetchGameHighlightIfNeeded,
} from '../containers/Popup/actions'
import { selectDate } from '../containers/DatePicker/dateSlice'
import { DATE_FORMAT } from '../utils/constant'

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'minute') {
    const { bs } = store.getState()
    const date = selectDate(store.getState())

    const dateStr = format(date, DATE_FORMAT)

    fetchGamesIfNeeded(dateStr)(store.dispatch, store.getState).then(() =>
      fetchGameHighlightIfNeeded()(store.dispatch, store.getState)
    )

    if (bs && bs.gid !== '') {
      fetchLiveGameBoxIfNeeded(dateStr, bs.gid)(store.dispatch, store.getState)
    }
  }
})
