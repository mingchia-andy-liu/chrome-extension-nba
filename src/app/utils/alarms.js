import moment from 'moment-timezone'
import browser from './browser'
import {store} from '../store'
import { fetchRequest as fetchBSRequest } from '../containers/BoxScores/actions'
import { fetchRequest as fetchGamesRequest } from '../containers/Popup/actions'

browser.alarms.create('minute', {
    delayInMinutes: 1,
    periodInMinutes: 1,
})

browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'minute') {
        const { bs, date: {date}} = store.getState()
        const dateStr = moment(date).format('YYYYMMDD')
        fetchGamesRequest(dateStr)
        if (bs && bs.gid !== '') {
            fetchBSRequest(dateStr, bs.gid)
        }
    }
})
