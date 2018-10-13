import moment from 'moment-timezone'
import { DATE_FORMAT } from '../utils/constant'


// returns the date string YYYYMMDD
export default () => {
    const ET = moment.tz(new Date(), 'America/New_York')
    const EThour = moment(ET).format('HH')
    let res
    // if ET time has not pass 6 am, don't jump ahead
    if (+EThour < 6) {
        res = moment(ET).subtract(1, 'day').format(DATE_FORMAT)
    } else {
        res = ET.format(DATE_FORMAT)
    }
    return moment(res, DATE_FORMAT).toDate()
}
