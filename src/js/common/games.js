function validateLiveGame(match) {
    if (match.stt === 'Final') {
        //finish
        match._status = 'finish'
        return 'finish'
    } else if (match.stt === 'PPD') {
        match._status = 'postponed'
        return 'postponed'
    } else if (match && !match.cl) {
        // haven't started
        match._status = 'prepare'
        return 'prepare'
    } else if (match.stt === 'Halftime' || match.stt.includes('End') || match.stt.includes('Start') || match.stt.includes('Qtr') || match.stt === 'Tipoff') {
        // live
        match._status = 'live'
        return 'live'
    } else if (match.cl === '00:00.0') {
        if (match.stt.includes('ET') || match.stt.includes('pm') || match.stt.includes('am')) {
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

/**
 * Check if there is any live games going one right now
 * @param {array} games
 * @returns {bool} true if there is one or more live game, false otherwise
 */
function anyLiveGames(games) {
    return !!games.find(function(match) {
        return match._status === 'live'
    })
}

/**
 * Check if there will be any live games, it will only be triggered if ther is
 * no live games at the moment
 */
function willHaveLiveGames(games) {
    return !!games.find(function(match) {
        return match._status === 'prepare'
    })
}

/**
 * Check if favourite is part of the game
 */
function checkFavGame(game) {
    if (game.h.ta === CONFIG.favTeam || game.v.ta === CONFIG.favTeam) {
        game._fav = true
        return true
    } else {
        game._fav = false
        return false
    }
}

function preprocessData(games) {
    // preprocess the data before anything
    var fav = []
    var live = []
    var finish = []
    var prepare = []
    games.forEach(function(game, index) {
        // adding property so the schedule in DATE_UTILS can be found
        game.gdte = moment(game.gcode.split('/')[0]).format('YYYY-MM-DD')
        checkFavGame(game)
        switch (validateLiveGame(game)) {
            case 'prepare':
                game._localTime = getGameStartTime(game.stt, game.gcode)
                if (prepare.length === 0) {
                    prepare.push(game)
                    break
                }
                const start = moment(game._localTime, ['h:mm A'])
                for (let i = 0; i < prepare.length; i++) {
                    // prepare items should have localTime because they were just inserted
                    const end = moment(prepare[i]._localTime, ['h:mm A'])
                    if (start.isBefore(end)) {
                        prepare.splice(i, 0, game)
                        break
                    } else if (i === prepare.length - 1) {
                        // latest
                        prepare.push(game)
                        break
                    }
                }
                break
            case 'live':
                live.push(game)
                break
            case 'finish':
                finish.push(game)
                break
            default:
                finish.push(game)
        }
    })

    const ordered = live.concat(finish.concat(prepare))
    const favGameIndex = ordered.findIndex(function(game) {
        return game._fav
    })
    if (favGameIndex != -1) {
        return ordered.splice(favGameIndex, 1).concat(ordered)
    } else {
        return ordered
    }
}

function getGameStartTime(status, gcode) {
    var date = gcode.split('/')[0]
    var today = moment(date, ['YYYYMMDD']).format('YYYY-MM-DD')
    var gameTime = moment(status, ['h:mm A']).format('HH:mm')
    var zone = 'America/New_York'
    var input = `${today} ${gameTime}`
    // guess() uses the Internationalization API
    var result = moment
        .tz(input, zone)
        .tz(moment.tz.guess())
        .format('hh:mm A')
    return result
}
