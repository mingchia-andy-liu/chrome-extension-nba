import moment from 'moment-timezone'
import { store } from '../../store'
import browser from '../../utils/browser'
import { fetchLiveGameBox } from './actions'

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'minute') {
        const { bs, date: {date}} = store.getState()
        if (bs && bs.gid) {
            fetchLiveGameBox(moment(date).format('YYYYMMDD'), bs.gid)
        }
    }
})

