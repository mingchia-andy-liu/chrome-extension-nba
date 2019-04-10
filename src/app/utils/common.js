/**
 * Returns the cloestest interval minute date
 * @param {number} interval
 * @param {moment obj} momentDate
 */
export const nearestMinutes = (interval, momentDate) => {
    const roundedMinutes = Math.round(momentDate.minute() / interval) * interval
    return momentDate.clone().minute(roundedMinutes).second(0)
}

/**
 * Returns the future of the nearest interval date
 * @param {number} interval
 * @param {moment obj} momentDate
 */
export const nextNearestMinutes = (interval, momentDate) => {
    const roundedMinutes = Math.ceil(momentDate.minute() / interval) * interval
    return momentDate.clone().minute(roundedMinutes).second(0)
}

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
    count += (+points) / 10 >= 1 ? 1 : 0
    count += (+assists) / 10 >= 1 ? 1 : 0
    count += (+steals) / 10 >= 1 ? 1 : 0
    count += (+blocks) / 10 >= 1 ? 1 : 0
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
    return games.map(element => ({
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

/**
 * Migrated from boxscore.js. Formats game status with clock or match status
 * @param {string} clock
 * @param {string} status
 */
export const formatClock = (clock, status, totalPeriod) => {
    if (status.includes('Halftime') || status.includes('Tipoff')) {
        // game started, clock stopped
        return status
    } else if (status === 'PPD') {
        //PPD mean postponed
        return 'Postponed'
    } else if (status.includes('Start') || status.includes('End')) {
        const statusArray = status.split(' ')
        if (status.includes('Qtr')) {
            return statusArray[0] + ' of Q' + statusArray[2].charAt(0)
        } else {
            return statusArray[0] + ' of OT' + statusArray[2].charAt(0)
        }
    } else if (status && status.includes('Qtr')) {
        // game started being played over regular time
        return 'Q' + status.charAt(0) + ' ' + clock
    } else if (status && status.includes('OT')) {
        // game start being played over over time
        return 'OT' + status.charAt(0) + ' ' + clock
    } else if (status.includes('Final')) {
        if (+totalPeriod > 4) {
            return `${status}/OT ${+totalPeriod - 4}`
        }
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
    if ((!self && !other) || (self === other)) {
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
export const noop = () => {}

const queryString = require('query-string')
export const getDateFromQuery = (props) => {
    const { date: queryDate } = queryString.parse(props.location.search)
    if (queryDate) {
        return queryDate
    }
}
