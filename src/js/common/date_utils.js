var DATE_UTILS = {}

DATE_UTILS.selectedDate = new Date()
DATE_UTILS.dailyAPIDate= new Date()
/**
 * String
 */
DATE_UTILS.fetchDataDate = '1960-01-01'
DATE_UTILS.maxDate = new Date('2018-06-17')
DATE_UTILS.minDate = new Date('2017-09-31')

DATE_UTILS.dailyAPISchedule = []
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

DATE_UTILS.searchGames = function(date) {
    if (moment(date).isSame(moment(DATE_UTILS.fetchDataDate), 'day')){
        return DATE_UTILS.dailyAPISchedule
    }
    var selectedDate = new Date(date)
    var month = selectedDate.getUTCMonth()+1
    var monthStr = month >= 10 ? month.toString() : `0${month}`
    var date = selectedDate.getUTCDate()
    var dateStr = date >= 10 ? date.toString() : `0${date}`
    var gameDateStr = `${selectedDate.getUTCFullYear()}-${monthStr}-${dateStr}`
    var monthIndex = month > 9 ? month - 9 : month + 3
    if (this.schedule.length < monthIndex) {
        return []
    }

    const gameArray = this.schedule[monthIndex].mscd.g
    const dateArray = gameArray.map(function(el) {
        return el.gdte
    })

    const startIndex = dateArray.indexOf(gameDateStr)
    const lastIndex = dateArray.lastIndexOf(gameDateStr)

    // console.log(gameArray)
    // console.log(startIndex)
    // console.log(lastIndex)
    return gameArray.slice(startIndex, lastIndex + 1)
}

DATE_UTILS.checkSelectToday = function(newDate) {
    if (newDate) {
        this.selectedDate = newDate
        return moment(this.newDate).isSame(this.fetchDataDate, "day")
    } else {
        return moment(this.selectedDate).isSame(this.fetchDataDate, "day")
    }
}

DATE_UTILS.parseDate = function(date) {
    var parts = date.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

/**
 * This is needed when the daily API endpoint doesn't update
 * But the date has passed. Use the full schedule's schedule
 */
DATE_UTILS.needNewSchedule = function(cacheData, d) {
    return cacheData.length > 0 && moment(cacheData[0].gcode.split('/')[0]).isBefore(d, 'day')
}
