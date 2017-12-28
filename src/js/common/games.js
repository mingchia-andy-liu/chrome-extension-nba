function validateLiveGame(match) {
    if (match.stt === 'Final') {
        //finish
        match._status = 'finish'
        return 'finish'
    } else if (match && !match.cl) {
        // haven't started
        match._status = 'prepare'
        return 'prepare'
    } else if (match.stt === 'Halftime' || match.stt.includes('End') || match.stt.includes('Start') || match.stt.includes('Qtr') || match.stt === 'Tipoff') {
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

/**
 * Check if there is any live games going one right now
 * @param {array} games
 * @returns {bool} true if there is one or more live game, false otherwise
 */
function anyLiveGames(games) {
    return !!games.find(function(match){
        return match._status === 'live'
    })
}

function preprocessData(games) {
    // preprocess the data before anything
    var live = []
    var finish = []
    var prepare = []
    games.forEach(function(game, index) {
        // adding property so the schedule in DATE_UTILS can be found
        game.gdte = moment(game.gcode.split('/')[0]).format('YYYY-MM-DD')
        switch (validateLiveGame(game)) {
            case 'prepare':
                game._localTime = getGameStartTime(game.stt, game.gcode)
                if (prepare.length === 0) {
                    prepare.push(game);
                    break
                }
                const start = moment(game._localTime, ["h:mm A"])
                for(let i = 0; i < prepare.length; i++) {
                    // prepare items should have localTime because they were just inserted
                    const end = moment(prepare[i]._localTime, ["h:mm A"])
                    if (start.isBefore(end)) {
                        prepare.splice(i, 0, game)
                        break
                    } else if (i === prepare.length - 1) {
                        // latest
                        prepare.push(game)
                        break
                    }
                }
                break;
            case 'live':
                live.push(game);
                break;
            case 'finish':
                finish.push(game)
                break;
            default:
                finish.push(game)
        }
    })
    return live.concat(finish.concat(prepare))
}

function getGameStartTime(status, gcode) {
    var date = gcode.split('/')[0]
    var today = moment(date, ["YYYYMMDD"]).format("YYYY-MM-DD")
    var gameTime = moment(status, ["h:mm A"]).format("HH:mm");
    var zone = "America/New_York";
    var input = `${today} ${gameTime}`
    var result = moment.tz(input, zone).local().format("hh:mm A");
    return result
}
