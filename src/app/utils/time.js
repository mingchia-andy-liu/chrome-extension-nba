import setMinutes from 'date-fns/setMinutes'
import setSeconds from 'date-fns/setSeconds'
import getMinutes from 'date-fns/getMinutes'

/**
 * Returns the cloestest interval minute date
 * @param {number} interval
 * @param {Date} date
 */
export const nearestMinutes = (interval, date) => {
  const roundedMinutes = Math.round(getMinutes(date) / interval) * interval
  return setSeconds(setMinutes(date, roundedMinutes), 0)
}

/**
 * Returns the future of the nearest interval date
 * @param {number} interval
 * @param {Date} date
 */
export const nextNearestMinutes = (interval, date) => {
  const roundedMinutes = Math.ceil(getMinutes(date) / interval) * interval
  return setSeconds(setMinutes(date, roundedMinutes), 0)
}

let timezone = ''
export const getUserTimeZoneId = () => {
  if (timezone !== '') {
    return timezone
  }
  if (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions) {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  } else {
    timezone = 'America/New_York'
  }
  return timezone
}
