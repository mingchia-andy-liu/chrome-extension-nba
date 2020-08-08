import { utcToZonedTime } from 'date-fns-tz'
import getHours from 'date-fns/getHours'
import subDays from 'date-fns/subDays'
import startOfDay from 'date-fns/startOfDay'
import { EST_IANA_ZONE_ID } from '../utils/constant'

/**
 * @returns {Date} start of the date
 */
export default () => {
  const now = new Date().toISOString()
  const etNow = utcToZonedTime(now, EST_IANA_ZONE_ID)
  const etNowHours = getHours(etNow)
  if (etNowHours < 6) {
    return startOfDay(subDays(etNow, 1))
  }
  return startOfDay(etNow)
}
