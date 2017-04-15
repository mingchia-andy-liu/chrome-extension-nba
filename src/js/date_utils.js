var DATE_UTILS = {}

DATE_UTILS.newDate = new Date()
DATE_UTILS.fetchDataDate = new Date()
DATE_UTILS.maxDate = new Date('2017-06-18')
DATE_UTILS.minDate = new Date('2016-10-25')

DATE_UTILS.schedule = []

DATE_UTILS.onArrowClick = function(offset) {
    let selectedDate = this.newDate.fp_incr(offset)
    if (selectedDate.getUTCFullYear() <= this.minDate.getUTCFullYear() &&
        selectedDate.getUTCMonth() <= this.minDate.getUTCMonth() &&
        selectedDate.getUTCDate() < this.minDate.getUTCDate()) {
        return false
    } else if (selectedDate.getUTCFullYear() >= this.maxDate.getUTCFullYear() &&
        selectedDate.getUTCMonth() >= this.maxDate.getUTCMonth() &&
        selectedDate.getUTCDate() > this.maxDate.getUTCDate()) {
        return false
    }
    this.newDate = selectedDate
    return true
}

DATE_UTILS.onSelectChange = function(date) {
    this.newDate = new Date(date)
}

DATE_UTILS.searchGames = function(date) {
    var selectedDate = new Date(date.selectedDates[0])
    // console.log(selectedDate)
    // console.log(this.schedule)
    var month = selectedDate.getUTCMonth()+1
    var monthStr = month >= 10 ? month.toString() : `0${month}`
    var date = selectedDate.getUTCDate()
    var dateStr = date >= 10 ? date.toString() : `0${date}`
    var gameDateStr = `${selectedDate.getUTCFullYear()}-${monthStr}-${dateStr}`
    // console.log(gameDateStr)
    var monthIndex = month > 7 ? month-10 : month+2
    if (!!!this.schedule[monthIndex]) {
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
        this.newDate = newDate
    }
    const today = new Date()
    if (this.newDate.getDay() !== this.fetchDataDate.getDay()) {
        return false
    }
    return (today.getFullYear() === this.newDate.getFullYear() &&
            today.getMonth() === this.newDate.getMonth() &&
            today.getDate() === this.newDate.getDate())
}

DATE_UTILS.parseDate = function(date) {
    var parts = date.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}