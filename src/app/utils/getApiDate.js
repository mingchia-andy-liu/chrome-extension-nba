import moment from 'moment-timezone'


// returns the millisecond of the API Date (ET timezone)
export default () => {
    const ET = moment.tz(moment(), 'America/New_York')
    const EThour = moment(ET).format('HH')
    // if ET time has not pass 6 am, don't jump ahead
    if (+EThour < 6) {
        return moment(ET).subtract(1, 'day')
    }
    return ET
}
