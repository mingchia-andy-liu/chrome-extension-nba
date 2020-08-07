import { utcToZonedTime } from 'date-fns-tz'
import getHours from 'date-fns/getHours'
import subDays from 'date-fns/subDays'
import startOfDay from 'date-fns/startOfDay'
import { EST_IANA_ZONE_ID } from '../utils/constant'

export const newApiDate = () => {
  const now = new Date().toISOString()
  const etNow = utcToZonedTime(now, EST_IANA_ZONE_ID)
  const etNowHours = getHours(etNow)
  if (etNowHours < 6) {
    return startOfDay(subDays(etNow, 1))
  }
  return startOfDay(etNow)
}

// returns the date string yyyyMMdd
export default () => {
  return newApiDate()
  // const ET = moment.tz(new Date(), EST_IANA_ZONE_ID)
  // const EThour = moment(ET).format('HH')
  // let res
  // // if ET time has not pass 6 am, don't jump ahead
  // if (+EThour < 6) {
  //   res = moment(ET).subtract(1, 'day').format(DATE_FORMAT)
  // } else {
  //   res = ET.format(DATE_FORMAT)
  // }
  // return moment(res, DATE_FORMAT).toDate()
}
