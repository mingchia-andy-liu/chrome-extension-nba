function validateLiveGame(match) {
    if (match.stt === 'Final') {
        //finish
        match._status = 'finish'
        return 'finish'
    } else if (match && !match.cl) {
        // haven't started
        match._status = 'prepare'
        return 'prepare'
    } else if (match.stt === 'Halftime' || match.stt.includes('End') || match.stt.includes('Start') || match.stt.includes('Qtr')) {
        // live
        match._status = 'live'
        return 'live'
    } else if (match.cl === '00:00.0') {
        if (match.stt.includes('ET') || match.stt.includes('pm') || match.stt.includes('am') || match.stt === 'PPD') {
            match._status = 'prepare'
            return 'prepare'
        }
    } else if (match.cl !== '' && match.cl !== '00:00.0') {
        match._status = 'live'
        return 'live'
    }
    match._status = 'prepare'
    return 'prepare'
}
