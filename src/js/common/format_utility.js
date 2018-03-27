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
    games = preprocessData(games)   // maybe too much overhead
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
    if (game._fav) {
        cardEl.addClass('u-fav')
    } else {
        cardEl.removeClass('u-fav')
    }

    $(scores[0]).text(game.v.s).removeClass(COLOR.GREEN);
    $(scores[1]).text(game.h.s).removeClass(COLOR.GREEN);

    matchinfoEl.find('.c-series').text('')   // series info
    if (game.stt === 'TBD') {   // playoff
        matchinfoEl.find('.c-series').text(game.seri)   // series info
        matchinfoEl.find('.c-hyphen').text('');
        matchinfoEl.find('.c-clock').text('TBA')
    } else if (game._status === 'finish'){
        matchinfoEl.find('.c-hyphen').text('-');
        if (parseInt(game.v.s) > parseInt(game.h.s)) {
            $(scores[0]).addClass(COLOR.GREEN);
        } else {
            $(scores[1]).addClass(COLOR.GREEN);
        }
        if ( (game.h.ot1 && game.h.ot1 !== 0) || (game.v.ot1 && game.v.ot1 !== 0)) {
            matchinfoEl.find('.c-clock').text('Final/OT').addClass(UTILS.CLOCK).removeClass(UTILS.TIME);
        } else {
            matchinfoEl.find('.c-clock').text('Final').addClass(UTILS.CLOCK).removeClass(UTILS.TIME);
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
        matchinfoEl.find('.c-clock').text(clock).addClass(UTILS.CLOCK).removeClass(UTILS.TIME);
    } else if (game._status === 'prepare'){
        const time = game._localTime || getGameStartTime(game.stt, game.gcode);
        // if (game.lm && game.lm.seri != '') {
        //     matchinfoEl.find('.c-series').text(game.lm.seri)
        // } else if (game.seri != '') {
        //     matchinfoEl.find('.c-series').text(game.seri)
        // }
        matchinfoEl.find('.c-hyphen').text('');
        $(scores[0]).text('').removeClass(COLOR.GREEN);
        $(scores[1]).text('').removeClass(COLOR.GREEN);
        matchinfoEl.find('.c-clock').text(time).addClass(UTILS.TIME);
    } else if (game._status === 'postponed') {
        let clock = formatClock(game.cl, 'PPD');
        matchinfoEl.find('.c-hyphen').text('');
        matchinfoEl.find('.c-clock').text(clock).addClass(UTILS.CLOCK).removeClass(UTILS.TIME);
    } else {
        let clock = formatClock(game.cl, game.stt);
        matchinfoEl.find('.c-hyphen').text('-');
        matchinfoEl.find('.c-clock').text(clock).addClass(UTILS.CLOCK).removeClass(UTILS.TIME);
    }

    const hColor = getLogoColor(game.h.ta)
    const vColor = getLogoColor(game.v.ta)
    awayTeamEl.find('.c-team-name').text(game.v.tn);
    awayTeamEl.find('.c-team-logo').text(game.v.ta).css('background-color', vColor);
    homeTeamEl.find('.c-team-name').text(game.h.tn);
    homeTeamEl.find('.c-team-logo').text(game.h.ta).css('background-color', hColor);
}

function updateLastUpdate(ms) {
    const d = ms ? new Date(ms) : new Date();
    const exactSeconds = moment(new Date()).diff(d, 'second')
    $("#lastUpdate").text(`Last updated: ${exactSeconds + 1} second(s) ago`);
}

function fetchData() {
    var deferred = $.Deferred();

    chrome.runtime.sendMessage({request : 'summary'}, function (data) {
        if (data && !data.failed) {
            const d = new Date()
            let newGames = preprocessData(data.gs.g);
            const isAnyGameLive = anyLiveGames(newGames)
            const willHaveLive = isAnyGameLive || willHaveLiveGames(newGames)

            // Set the badge text when the alarm hasn't go off but the extension is opened
            setLiveBadge(isAnyGameLive)

            if (!isAnyGameLive && !willHaveLive && DATE_UTILS.needNewSchedule(data.gs.gdte, d)) {
                DATE_UTILS.selectedDate = moment(d).toDate()

                // API is in different DATE then the timezone date
                // use the correct games in the schedule
                const correctGames = DATE_UTILS.searchGames(d)
                DATE_UTILS.updateSchedule(d, newGames)
                const newSchedule = DATE_UTILS.getRawSchedule()
                const newCacheDate = moment(d).format('YYYY-MM-DD')

                updateLastUpdate(d)
                updateCards(correctGames)
                chrome.storage.local.set({
                    'popupRefreshTime' : d.getTime(),
                    'cacheData' : correctGames,
                    'fetchDataDate' : newCacheDate,
                    'schedule': newSchedule
                });
                deferred.resolve(correctGames, newCacheDate);
            } else {
                DATE_UTILS.selectedDate = moment(data.gs.gdte).toDate()
                updateLastUpdate(d);
                updateCards(newGames);
                chrome.storage.local.set({
                    'popupRefreshTime' : d.getTime(),
                    'cacheData' : newGames,
                    'fetchDataDate' : data.gs.gdte
                });
                deferred.resolve(newGames, data.gs.gdte);
            }
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
