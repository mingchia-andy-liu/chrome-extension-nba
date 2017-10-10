function validateLiveGame(match) {
    return match.cl &&
            ((match.cl !== '00:00.0' && match.stt !=='Final') ||
             (match.cl === '00:00.0' && (match.stt === 'Halftime' || match.stt.includes('End'))));
}

function getGameStartTime(status) {
    // returns in minute of the diff to UTC
    var today = new Date();
    var timeZoneOffset = today.getTimezoneOffset();

    var gameStatus = status.split(' ');      // 12:30 pm ET
    var gameTime = gameStatus[0].split(':');    // [12,30]
    var gameHour = Number.parseInt(gameTime[0]);                 // hour --> 12
    var gameMinute = Number.parseInt(gameTime[1]);               // minute --> 30
    if (gameStatus[1] === 'pm' && gameHour !== 12) {
        gameHour = gameHour + 12;
    }
    var gameTimezoneMinute = gameMinute + (timeZoneOffset/60) % 1 * 60;
    var timeDiff = 4;
    var gameTimezoneHour = gameHour + timeDiff - Math.floor(timeZoneOffset/60);    // convert ET to UTC to local
    if (gameTimezoneMinute >= 60) {
        gameTimezoneHour++;
        gameTimezoneMinute -= 60;
    } else if (gameTimezoneMinute < 0) {
        gameTimezoneHour--;
        gameTimezoneMinute += 60;
    }
    if (gameTimezoneMinute < 10) {
        gameTimezoneMinute = '0' + gameTimezoneMinute.toString();
    } else {
        gameTimezoneMinute = gameTimezoneMinute.toString();
    }
    var timeFormat = 'AM';
    if (gameTimezoneHour < 24 && gameTimezoneHour >= 12) {
        timeFormat = 'PM';
    }
    if (gameTimezoneHour >= 24){    // a new day
        gameTimezoneHour -= 24;
    } else if (gameTimezoneHour > 12){
        gameTimezoneHour -= 12;
    }
    // hour + minute + am/pm
    return gameTimezoneHour.toString() + ':' + gameTimezoneMinute + ' ' + timeFormat;
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
}

function gameReording(games) {
    // re-ordering: live --> finished --> haven't started
    var orderedGames = [];
    for (let i = 0; i < games.length; i++) {
        if (validateLiveGame(games[i])) {
            orderedGames.unshift(games[i]);
        } else {
            orderedGames.push(games[i]);
        }
    }
    return orderedGames;
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

    $(scores[0]).text(game.v.s).removeClass(COLOR.GREEN);
    $(scores[1]).text(game.h.s).removeClass(COLOR.GREEN);

    matchinfoEl.find('.c-series').text('')   // series info
    if (game.stt === 'TBD') {   // playoff
        matchinfoEl.find('.c-series').text(game.seri)   // series info
        matchinfoEl.find('.c-hyphen').text('');
        matchinfoEl.find('.c-clock').text('TBA')
    } else if (game.stt === 'Final'){
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
    } else if (validateLiveGame(game)) {
        $(scores[0]).text(game.v.s);
        $(scores[1]).text(game.h.s);
        if (parseInt(game.v.s) > parseInt(game.h.s))
            $(scores[0]).addClass(COLOR.GREEN);
        else if (parseInt(game.v.s) < parseInt(game.h.s))
            $(scores[1]).addClass(COLOR.GREEN);
        let clock = formatClock(game.cl, game.stt);
        matchinfoEl.find('.c-hyphen').text('-');
        matchinfoEl.find('.c-clock').text(clock).addClass(UTILS.CLOCK);
    } else if (game.stt.includes('ET') || game.stt.includes('pm') || game.stt.includes('am') || game.stt === 'PPD'){
        let time = getGameStartTime(game.stt);
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
    var hColor = '#000000';
    var vColor = '#000000';
    if (LOGO_COLORS[game.h.ta]) {
        hColor = LOGO_COLORS[game.h.ta];
    }
    if (LOGO_COLORS[game.v.ta]) {
        vColor = LOGO_COLORS[game.v.ta];
    }
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
            let newGames = gameReording(data.gs.g);
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
