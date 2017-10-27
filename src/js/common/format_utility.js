function validateLiveGame(match) {
    if (match.stt === 'Final') {
        //finished
        match._status = 'finished'
        return 'finished'
    } else if (match && !match.cl) {
        // haven't started
        match._status = 'prepare'
        return 'prepare'
    } else if (match.cl === '00:00.0') {
        if (match.stt === 'Halftime' || match.stt.includes('End')) {
            // live
            match._status = 'live'
            return 'live'
        } else if (match.stt.includes('ET') || match.stt.includes('pm') || match.stt.includes('am') || match.stt === 'PPD') {
            match._status = 'prepare'
            return 'prepare'
        }
    } else if (match.cl !== '00:00.0') {
        match._status = 'live'
        return 'live'
    }
    match._status = 'prepare'
    return 'prepare'
}

function preprocessData(games) {
    // preprocess the data before anything
    var live = []
    var finished = []
    var prepare = []
    games.forEach(function(game, index) {
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
            case 'finished':
                finished.push(game)
                break;
            default:
                finished.push(game)
        }
    })
    return live.concat(prepare.concat(finished))
}

function getGameStartTime(status, gcode) {
    // returns in minute of the diff to UTC
    var date = gcode.split('/')[0]
    var today = moment(date, ["YYYYMMDD"]).format("YYYY-MM-DD")
    var gameTime = moment(status, ["h:mm A"]).format("HH:mm");
    var zone = "America/New_York";
    var input = `${today} ${gameTime}`
    var result = moment.tz(input, zone).local().format("hh:mm A");
    debugger
    return result
}

function formatClock(clock, status) {
    if (status.includes('Halftime') || status.includes('Tipoff')){    // game started, clock stopped
        return status;
    } else if (status === 'PPD') {  //PPD mean postponed
        return 'Postponed';
    } else if (status.includes('Start') || status.includes('End')){
        var statusArray = status.split(' ');
        if (status.includes('Qtr')) {
            return statusArray[0] + ' of Q' + statusArray[2].charAt(0);
        } else {
            return statusArray[0] + ' of OT' + statusArray[2].charAt(0);
        }
    } else if (status && status.includes('Qtr')) {  // game started being played over regular time
        return 'Q' + status.charAt(0) + ' ' + clock;
    } else if (status && status.includes('OT')) {   // game start being played over over time
        return 'OT' + status.charAt(0) + ' ' + clock;
    }
    return clock
}

// Fetch Data
function updateCards(games) {
    if (games && games.length === 0) {
        $(".c-card.no-game").removeClass('u-hide');
    } else {
        $(".c-card.no-game").addClass('u-hide');
    }
    $('.c-card:not(.no-game)').each(function(index, el){
        if (index >= games.length) {
            $(el).addClass('u-hide');
        } else {
            $(el).removeClass('u-hide');
            updateCardWithGame(el, games[index]);
        }
    });
    if (games.length === 0) {
        $(".c-card.no-game").html(NO_GAME_TEXT);
    }
}

function updateCardWithGame(card, game) {
    var cardEl = $(card).attr('gid', game.gid);
    var teams = cardEl.find('.c-team-info');
    var matchinfoEl = $(cardEl.find('.c-match-info'));
    var scores = matchinfoEl.find('.c-team-score');
    var awayTeamEl = $(teams[0]);
    var homeTeamEl = $(teams[1]);
    validateLiveGame(game)

    $(scores[0]).text(game.v.s).removeClass(COLOR.GREEN);
    $(scores[1]).text(game.h.s).removeClass(COLOR.GREEN);

    matchinfoEl.find('.c-series').text('')   // series info
    if (game.stt === 'TBD') {   // playoff
        matchinfoEl.find('.c-series').text(game.seri)   // series info
        matchinfoEl.find('.c-hyphen').text('');
        matchinfoEl.find('.c-clock').text('TBA')
    } else if (game._status === 'finished'){
        matchinfoEl.find('.c-hyphen').text('-');
        if (parseInt(game.v.s) > parseInt(game.h.s)) {
            $(scores[0]).addClass(COLOR.GREEN);
        } else {
            $(scores[1]).addClass(COLOR.GREEN);
        }
        if ( (game.h.ot1 && game.h.ot1 !== 0) || (game.v.ot1 && game.v.ot1 !== 0)) {
            matchinfoEl.find('.c-clock').text('Final/OT').addClass(UTILS.CLOCK);
        } else {
            matchinfoEl.find('.c-clock').text('Final').addClass(UTILS.CLOCK);
        }
    } else if (game._status === 'live') {
        $(scores[0]).text(game.v.s);
        $(scores[1]).text(game.h.s);
        if (parseInt(game.v.s) > parseInt(game.h.s))
            $(scores[0]).addClass(COLOR.GREEN);
        else if (parseInt(game.v.s) < parseInt(game.h.s))
        $(scores[1]).addClass(COLOR.GREEN);
        let clock = formatClock(game.cl, game.stt);
        matchinfoEl.find('.c-hyphen').text('-');
        matchinfoEl.find('.c-clock').text(clock).addClass(UTILS.CLOCK);
    } else if (game._status === 'prepare'){
        const time = game._localTime || getGameStartTime(game.stt, game.gcode);
        if (game.lm && game.lm.seri != '') {
            matchinfoEl.find('.c-series').text(game.lm.seri)
        } else if (game.seri != '') {
            matchinfoEl.find('.c-series').text(game.seri)
        }
        matchinfoEl.find('.c-hyphen').text('');
        $(scores[0]).text('').removeClass(COLOR.GREEN);
        $(scores[1]).text('').removeClass(COLOR.GREEN);
        matchinfoEl.find('.c-clock').text(time).addClass(UTILS.TIME);
    } else {
        let clock = formatClock(game.cl, game.stt);
        matchinfoEl.find('.c-hyphen').text('-');
        matchinfoEl.find('.c-clock').text(clock).addClass(UTILS.CLOCK);
    }
    var hColor = LOGO_COLORS[game.h.ta] || '#000000';
    var vColor = LOGO_COLORS[game.v.ta] || '#000000';
    awayTeamEl.find('.c-team-name').text(game.v.tn);
    awayTeamEl.find('.c-team-logo').text(game.v.ta).css('background-color', vColor);
    homeTeamEl.find('.c-team-name').text(game.h.tn);
    homeTeamEl.find('.c-team-logo').text(game.h.ta).css('background-color', hColor);
}

function updateLastUpdate(ms) {
    var d = ms ? new Date(ms) : new Date();
    var hour = d.getHours().toString();
    hour = hour.length === 1 ? '0' + hour : hour;
    var min = d.getMinutes().toString();
    min = min.length === 1 ? '0' + min : min;
    var sec = d.getSeconds().toString();
    sec = sec.length === 1 ? '0' + sec : sec;
    $("#lastUpdate").text('Last updated: ' + hour + ':' + min + ':' + sec);
}

function fetchData() {
    var deferred = $.Deferred();

    chrome.runtime.sendMessage({request : 'summary'}, function (data) {
        if (data && !data.failed) {
            updateLastUpdate();
            let newGames = preprocessData(data.gs.g);
            updateCards(newGames);
            chrome.storage.local.set({
                'popupRefreshTime' : new Date().getTime(),
                'cacheData' : newGames,
                'fetchDataDate' : data.gs.gdte
            });
            deferred.resolve(newGames, data.gs.gdte);
        } else if (data && data.failed) {
            console.log('failed');
            deferred.reject();
        } else {
            console.log('something went wrong');
            deferred.reject();
        }
    });
    return deferred.promise();
}

function fetchFullSchedule() {
    var deferred = $.Deferred()

    chrome.runtime.sendMessage({request : 'schedule'}, function (data) {
        if (data && !data.failed) {
            chrome.storage.local.set({
                'schedule' : data,
                'scheduleRefreshTime' : new Date().getTime()
            })
            deferred.resolve(data)
        } else if (data && data.failed) {
            console.log('failed')
            deferred.reject()
        } else {
            console.log('something went wrong')
            deferred.reject()
        }
    })

    return deferred.promise()
}
