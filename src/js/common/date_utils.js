var DATE_UTILS = {}

DATE_UTILS.selectedDate = new Date()
DATE_UTILS.fetchDataDate = '1960-01-01'
DATE_UTILS.maxDate = new Date('2018-06-17')
DATE_UTILS.minDate = new Date('2017-09-31')

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
    const lastIndex = this.schedule.findIndex(function(game){
        return game.gdte === nextDay
    })
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
        return moment(this.newDate).isSame(this.fetchDataDate, "day")
    } else {
        return moment(this.selectedDate).isSame(this.fetchDataDate, "day")
    }
}

DATE_UTILS.parseDate = function(date) {
    debugger
    console.log(`[parseDate] ${date}`)
    var parts = date.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
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
