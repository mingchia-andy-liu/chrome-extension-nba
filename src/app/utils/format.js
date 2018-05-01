export const formatClock = (clock, status) => {
    if (status.includes('Halftime') || status.includes('Tipoff') || status.includes('Final')) {
        // game started, clock stopped
        return status
    } else if (status === 'PPD') {
        //PPD mean postponed
        return 'Postponed'
    } else if (status.includes('Start') || status.includes('End')) {
        var statusArray = status.split(' ')
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
    }
    return clock
}
