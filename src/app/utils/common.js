/**
 * Returns represented doubles of the player
 * @param {obj} player
 */
export const hasDoubles = (player) => {
  let count = 0
  const {
    rebounds_defensive,
    rebounds_offensive,
    assists,
    steals,
    blocks,
    points,
  } = player
  count += (+rebounds_offensive + +rebounds_defensive) / 10 >= 1 ? 1 : 0
  count += +points / 10 >= 1 ? 1 : 0
  count += +assists / 10 >= 1 ? 1 : 0
  count += +steals / 10 >= 1 ? 1 : 0
  count += +blocks / 10 >= 1 ? 1 : 0
  switch (count) {
    case 2:
      return 'd'
    case 3:
      return 't'
    case 4:
      return 'q'
    case 5:
      return 'p'
    default:
      return ''
  }
}

/**
 * Get `alt` text for the double doubles
 * @param {string} doubles
 */
export const getDoublesText = (doubles) => {
  switch (doubles) {
    case 'd':
      return 'Double Doubles'
    case 't':
      return 'Triple Doubles'
    case 'q':
      return 'Quadruple Doubles'
    case 'p':
      return 'Quintuple Doubles'
    default:
      return ''
  }
}

/**
 * Decorate the array of games with important fields
 * @param {array} games
 */
export const formatGames = (games) => {
  return games.map((element) => ({
    ...element,
    series: element.lm.seri,
    hta: element.h.ta,
    htn: element.h.tn,
    hs: element.h.s,
    vta: element.v.ta,
    vtn: element.v.tn,
    vs: element.v.s,
  }))
}

const statusTextRegex =
  /^([OT|Q][0-9]{1,2}) [0-9]{1,2}:[0-9]{1,2}(\.[0-9]{1,3})?$/
/**
 * Migrated from boxscore.js. Formats game status with clock or match status
 * @param {string} clock
 * @param {string} status
 */
export const formatClock = (clock, status, totalPeriod) => {
  if (status === 'Half') {
    return 'Halftime'
  } else if (status.includes('Halftime') || status.includes('Tipoff')) {
    // game started, clock stopped
    return status
  } else if (status === 'PPD' || clock === 'PPD') {
    // PPD mean postponed
    return 'Postponed'
  } else if (
    (status.startsWith('Start') || status.startsWith('End')) &&
    status.includes('of')
  ) {
    // Start/End of 1st Qtr/OT
    const statusArray = status.split(' ')
    if (status.includes('Qtr')) {
      return statusArray[0] + ' of Q' + statusArray[2].charAt(0)
    } else if (status.includes('OT')) {
      return statusArray[0] + ' of OT' + statusArray[2].charAt(0)
    } else {
      return status
    }
  } else if (
    (status.startsWith('Start') || status.startsWith('End')) &&
    !status.includes('of')
  ) {
    // Start/End Q/OT1
    return status
  } else if (status && status.includes('Qtr') && status.includes('of')) {
    // game started being played over regular time
    return 'Q' + status.charAt(0) + ' ' + clock
  } else if (status && status.includes('OT') && status.includes('of')) {
    // game start being played over over time
    return 'OT' + status.charAt(0) + ' ' + clock
  } else if (status.includes('Final')) {
    if (+totalPeriod > 4) {
      if (status.includes('OT')) {
        return `${status} ${+totalPeriod - 4}`
      } else {
        return `${status}/OT ${+totalPeriod - 4}`
      }
    }
    return status
  } else if (+totalPeriod === 0) {
    return status
  } else if (statusTextRegex.test(status)) {
    // already formatted
    return status
  }
  return clock
}

/**
 * Format Box score table's player minutes.
 */
export const formatMinutes = ({ minutes, seconds }) => {
  if (minutes < 10 || minutes.length === 1) {
    minutes = `0${minutes}`
  }
  if (seconds < 10 || seconds.length === 1) {
    seconds = `0${seconds}`
  }
  return `${minutes}:${seconds}`
}

/**
 * convert numerical decimal to percentage
 * @param {*} decimal
 *
 * @returns {string} 2 decimal percentage
 */
export const toPercentage = (decimal) => {
  if (Number.isNaN(decimal)) return '-'
  else return (decimal * 100).toFixed()
}

/**
 * determine who is winning
 */
export const isWinning = (self, other) => {
  if ((!self && !other) || self === other) {
    return true
  } else {
    return +self > +other
  }
}

/**
 * get background color for odd number rows
 */
export const getOddRowColor = (i, isDark) => {
  if (i % 2 === 1) {
    if (isDark) return 'hsl(0, 0%, 25%)'
    else return 'hsl(0, 0%, 95%)'
  }
}

/**
 * noop
 */
export const noop = () => undefined

const queryString = require('query-string')
export const getDateFromQuery = (location) => {
  const { date: queryDate } = queryString.parse(location.search)
  if (queryDate) {
    return queryDate
  }
}

export const delay = (t = 500) =>
  new Promise((resolve, reject) => setTimeout(resolve, t))

export const waitUntilFinish = async (
  getValue,
  expected,
  ms = 500,
  tries = 10
) => {
  for (let i = 0; i < tries; i++) {
    await delay(ms)
    if (getValue() === expected) {
      break
    }
  }
}

export const allSettled = (promises) =>
  Promise.all(
    promises.map((promise) =>
      promise
        .then((data) => ({ status: 'fullfilled', value: data }))
        .catch((error) => ({ status: 'rejected', reason: error }))
    )
  )
