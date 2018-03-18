var DATE_UTILS = {}

DATE_UTILS.selectedDate = new Date()
DATE_UTILS.fetchDataDate = '1960-01-01'
DATE_UTILS.maxDate = new Date('2018-06-17')
DATE_UTILS.minDate = new Date('2017-09-30')

DATE_UTILS.schedule = []

DATE_UTILS.onArrowClick = function(offset) {
    const newDate = moment(this.selectedDate).add(offset, 'days')
    if (newDate.isBefore(DATE_UTILS.minDate) ||
        newDate.isAfter(DATE_UTILS.maxDate)) {
        return false
    }
    this.selectedDate = newDate.toDate()
    return true
}

DATE_UTILS.onSelectChange = function(date) {
    this.selectedDate = new Date(date)
}

/**
 * @param {object} schedule the schedule returned by the API
 *   @property {array}
 *     @property {object} mscd monthly game object
 *       @property {array} g games array
 *       @property {string} str in string
 */
DATE_UTILS.setSchedule = function(schedule) {
    const gamesArray = schedule.map(function(month){
        return month.mscd.g
    })
    const allGames = gamesArray.reduce(function(total, month){
        return total.concat(month)
    })

    this.schedule = allGames
}


/**
 * A getter method of [{month.mscd.g}, {month.mscd.g}, ...] schedule
 * @returns {array} [{month.mscd.g}, ...]
 */
DATE_UTILS.getRawSchedule = function() {
    const group_to_values = this.schedule.reduce(function (obj, item) {
        const month = item.gdte.substring(5, 7)
        obj[month] = obj[month] || []
        obj[month].push(item)
        return obj
    }, {})

    const groups = Object.keys(group_to_values).map(function (key) {
        return {
            mscd: {
                g: group_to_values[key],
                month: key
            }
        }
    });

    // move September to the first element
    groups.unshift(groups.splice(3, 1)[0])
    return groups
}

/**
 * Update the API's schedule when the
 *     1. daily API still on the previous date's games
 *     2. schedule API has not update the endpoint
 * @param {Date} date  the "current" date
 * @param {games} games the previous API's games end versions
 */
DATE_UTILS.updateSchedule = function(date, games) {
    const prevDay = moment(date).subtract(1, 'day').format('YYYY-MM-DD')
    const startIndex = this.schedule.findIndex(function(game){
        return game.gdte === prevDay
    })

    games.forEach(function(item, index) {
        DATE_UTILS.schedule.splice(startIndex + index, 1, item)
    })
}


/**
 * Find the array games from the schedule's API
 * @param {Date} date the current date of the timezone
 *
 * @returns {array}
 *   @property {game} games from the schedule API of the @param date
 */
DATE_UTILS.searchGames = function(date) {
    const selectedDate = moment(date)

    const selectedDateStr = selectedDate.format('YYYY-MM-DD')
    const nextDay = selectedDate.add(1, 'day').format('YYYY-MM-DD')

    const startIndex = this.schedule.findIndex(function(game){
        return game.gdte === selectedDateStr
    })
    if (startIndex === -1) {
        return []
    }
    // need to find the last game of the day
    const secondHalf = this.schedule.slice(startIndex).reverse()
    let lastIndex = secondHalf.findIndex(function(game){
        return game.gdte === selectedDateStr
    })
    lastIndex = secondHalf.length - lastIndex + startIndex
    return this.schedule.slice(startIndex, lastIndex)
}

/**
 * Check if the parameter is the same date as the timezone date
 * @param {Date} newDate is the API's date or the calendar's date
 *
 * @returns {Boolean} true if the same day, false otherwise
 */
DATE_UTILS.checkSelectToday = function(newDate) {
    if (newDate) {
        this.selectedDate = newDate
        return moment(newDate).isSame(this.fetchDataDate, "day")
    } else {
        return moment(this.selectedDate).isSame(this.fetchDataDate, "day")
    }
}

/**
 * This is needed when the daily API endpoint doesn't update
 * But the date has passed. Use the full schedule's schedule
 * @param {string} dataDate the API's return date
 * @param {Date} today current date
 *
 * @returns {Boolean} check if the @param dateDate is before the @param today
 */
DATE_UTILS.needNewSchedule = function(dataDate, today) {
    return moment(dataDate).isBefore(today, 'day')
}
