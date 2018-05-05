import moment from 'moment-timezone'


// returns the millisecond of the API Date (ET timezone)
export default () => {
    const ET = moment.tz(moment(), 'America/New_York')
    return ET
    // if (ET.isBefore(ET'6', 'hour')) {
    //     return ET.add(-1)
    // } else {
    //     return ET
    // }
}
