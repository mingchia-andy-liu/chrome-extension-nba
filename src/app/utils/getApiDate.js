import { utcToZonedTime } from 'date-fns-tz'
import getHours from 'date-fns/getHours'
import subDays from 'date-fns/subDays'
import startOfDay from 'date-fns/startOfDay'
import getMonth from 'date-fns/getMonth'
import getYear from 'date-fns/getYear'
import addYears from 'date-fns/addYears'
import isBefore from 'date-fns/isBefore'
import isAfter from 'date-fns/isAfter'
import { EST_IANA_ZONE_ID } from '../utils/constant'
import getDate from 'date-fns/getDate'

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
    // 2020 season is delayed and season should finish in 2020-10
    return getMonth(date) > 9 ? getYear(date) : getYear(addYears(date, -1))
  } else {
    // if it's after july, it's a new season
    return getMonth(date) > 5 ? getYear(date) : getYear(addYears(date, -1))
  }
}

export const isOffseason = (date) => {
  const d = date ?? new Date()
  // 2019-2020 season October 11, 2020 (Finals)
  // 2020-2021 season December 22, 2020
  if (getYear(d) === 2020) {
    // between October and
    return (
      isAfter(d, new Date('2020-10-12')) && isBefore(d, new Date('2020-12-21'))
    )
  } else {
    // between july and august
    const month = getMonth(d)
    const day = getDate(d)
    if (isNaN(month) || isNaN(day)) {
      return false
    }

    return month < 8 && month > 6
  }
}
