import { utcToZonedTime } from 'date-fns-tz'
import getHours from 'date-fns/getHours'
import subDays from 'date-fns/subDays'
import startOfDay from 'date-fns/startOfDay'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'
import addYears from 'date-fns/addYears'
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

export const getLeagueYear = (date) => {
  if (getYear(date) === 2020) {
    // 2020 season is delayed and season should finish in 2020-09
    return getMonth(date) > 8 ? getYear(date) : getYear(addYears(date, -1))
  } else {
    // if it's after july, it's a new season
    return getMonth(date) > 5 ? getYear(date) : getYear(addYears(date, -1))
  }
}
