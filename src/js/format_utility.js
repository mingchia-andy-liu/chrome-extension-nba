function validateLiveGame(match) {
    return match.cl &&
            ((match.cl !== '00:00.0' && match.stt !=='Final') ||
             (match.cl === '00:00.0' && (match.stt === 'Halftime' || match.stt.includes('End'))));
}

// FORMAT CARD
function formatCard(match) {
    // score board
    var awayTeamScore = formatTeamScore(match.v.s, match.v.s > match.h.s);
    var homeTeamScore = formatTeamScore(match.h.s, match.v.s < match.h.s);
    var hyphen = formatTag('-', 'div', [UTILS.HYPHEN]);
    var scoreBoardText = awayTeamScore + hyphen + homeTeamScore;
    var scoreBoard = formatTag(scoreBoardText, 'div', [UTILS.FLEX, UTILS.CENTER]);
    var matchInfoDetails = '';

    if (match.stt === 'Final'){
        matchInfoDetails += scoreBoard;
        let clockText = formatClock(match.cl, match.stt);
        matchInfoDetails += formatTag(clockText, 'div', [UTILS.CLOCK]);
    } else if (validateLiveGame(match)) {
        matchInfoDetails += scoreBoard;
        let clockText = formatClock(match.cl, match.stt);
        matchInfoDetails += formatTag(clockText, 'div', [UTILS.CLOCK]);

        if (match.cl && match.cl !== '00:00.0'){
            var slideBounce = formatTag('', 'div', [UTILS.SLIDE_BOUNCE]);
            matchInfoDetails += formatTag(slideBounce, 'div', [UTILS.SLIDER]);
        }
    } else {
        let clockText = formatClock(match.cl, match.stt);
        matchInfoDetails += formatTag(clockText, 'div', [UTILS.CLOCK]);
    }

    //match info
    // var gameList = formatLinkTag('box-score.html', '', "/src/assets/vector/icon-list-black-48.svg");
    // var gameListDiv = formatTag(gameList, 'div', [UTILS.LINK]);
    // var gameLink = formatLinkTag('https://watch.nba.com/game/' + match.gcode, '', "/src/assets/vector/icon-link-black-48.svg");
    // var gameLinkDiv = formatTag(gameLink, 'div', [UTILS.LINK, 'u-center']);
    // var listDiv = formatTag(gameListDiv + gameLinkDiv, 'div', [UTILS.FLEX, UTILS.JUSTIFY_AROUND]);
    // matchInfoDetails += gameLinkDiv;
    var matchInfo = formatTag(matchInfoDetails, 'div', [UTILS.MATCH_INFO]);

    //team info
    var awayTeam = formatTeamInfoTags(match.v.tn, match.v.tc + " (A)", LOGOS[match.v.ta]);
    var homeTeam = formatTeamInfoTags(match.h.tn, match.h.tc + " (H)", LOGOS[match.h.ta]);

    //card
    var matchCard = formatTag(awayTeam + matchInfo + homeTeam, 'div', [UTILS.CARD, UTILS.SHADOW]);
    return matchCard;
}

function formatTeamScore(score, winning) {
    if (winning) {
        return formatTag(score, 'span', [UTILS.TEAM_SCORE, COLOR.RED]);
    } else {
        return formatTag(score, 'span', [UTILS.TEAM_SCORE]);
    }
}

function getGameStartTime(status) {
    var currDate = new Date();
    // returns in minute of the diff to UTC
    var timeZoneOffset = currDate.getTimezoneOffset();

    var gameStatus = status.split(' ');      // 12:00 pm ET
    var gameTime = gameStatus[0].split(':');    // 12 00
    var gameHour = gameTime[0];                 // hour --> 12
    if (gameStatus[1] === 'pm') {
        gameHour = parseInt(gameHour) + 12;
    }
    var gameTimezoneHour = gameHour + 5 - timeZoneOffset/60;    // convert ET to UTC to local
    var timeFormat = 'am';
    if (gameTimezoneHour >= 12) {
        timeFormat = 'pm';
    }
    if (gameTimezoneHour > 12){
        gameTimezoneHour -= 12;
    }
    // hour + minute
    gameTime = gameTimezoneHour.toString() + ':' + gameTime[1] + ' ' + timeFormat;

    //  local game time
    return gameTime;
}

function formatClock(clock, status) {
    var text = '-';
    if ((!clock || clock === '00:00.0') && status.includes('ET')) {   // game hasn't start, clock is null
        text = getGameStartTime(status);
    } else if (status.includes('Final') ||
                status.includes('Halftime') ||
                status.includes('Tipoff')){    // game started, clock stopped
        text = status;
    } else if (status.includes('Start') || status.includes('End')){
        var statusArray = status.split(' ');
        if (status.includes('Qtr')) {
            text = statusArray[0] + ' of Q' + statusArray[2].charAt(0);
        } else {
            text = statusArray[0] + ' of OT' + statusArray[2].charAt(0);
        }
    } else if (status && status.includes('Qtr')) {  // game started being played over regular time
        text = 'Q' + status.charAt(0) + ' ' + clock;
    } else if (status && status.includes('OT')) {   // game start being played over over time
        text = 'OT' + status.charAt(0) + ' ' + clock;
    }

    return text;
}

function formatTeamInfoTags(teamName, teamCity, teamLogo) {
    // var team = formatTag(teamLogo, 'div', [UTILS.TEAM_LOGO]);
    var team = formatTag(teamName, 'div', [UTILS.TEXT_BOLDER, UTILS.TEAM_NAME]);
    team += formatTag(teamCity, 'div', [UTILS.TEXT_ITALIC, UTILS.TEAM_CITY]);
    return formatTag(team, 'div', [UTILS.TEAM_INFO]);
}

function formatLinkTag(url, text, image) {
    if (image && text) {
        return '<a href=' + url + '>' + '<img src="' + image +'">' + text + '</a>';
    } else if (image) {
        return '<a href=' + url + '>' + '<img src="' + image +'"></a>';
    } else {
        return '<a href=' + url + '>' + text + '</a>';
    }
}

function formatTag(content, tag, classes, text) {
    switch (tag){
        case 'div':
        case 'span':
            if(classes && classes.length > 0) {
                var classNames = classes.join(' ');
                return '<' + tag + " class='" + classNames + "''>" + content + '</' + tag + '>';
            } else {
                return '<' + tag + '>' + content + '</' + tag + '>';
            }
            break;
        default:
            return '<div>OOPS, TAG NAME NOT FOUND></div>';
    }
}

// FORMAT TABLE
function formatTableRow(data) {
    var result = '';
    if (data && data.length) {
        if (data[0] !== '' && data[1] !== '' && !data[2].includes(':')) {
            if (data[0] !== '' || data[1] !== '') {
                result += '<td>' + data[0] + '<br>' + data[1] + '</td>';
            } else {
                result += '<td></td>';
            }
            result += "<td colspan='17'>" + data[2] + '</td>';
        } else {
            if (data[0] !== '' || data[1] !== '') {
                result += '<td>' + data[0] + '<br>' + data[1] + '</td>';
            } else {
                result += '<td></td>';
            }
            for (let i = 2; i < data.length; i++) {
                result += '<td>' + data[i] + '</td>';
            }
        }
    }
    result = '<tr>' + result + '</tr>';
    return result;
}

function formatBoxScoreData(player) {
    var playerRecord = ['','','00:00',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    playerRecord[0] = player.fn || playerRecord[0];
    if (player.pos) {
        playerRecord[1] = player.ln + (' ' + player.pos).sup() || playerRecord[1];
    } else {
        playerRecord[1] = player.ln || playerRecord[1];
    }
    playerRecord[2] = formatMinutes(player);
    playerRecord[3] = player.fgm.toString() + '-' + player.fga.toString();
    playerRecord[4] = toPercentage(player.fgm/player.fga);
    playerRecord[5] = player.tpm.toString() + '-' + player.tpa.toString();
    playerRecord[6] = toPercentage(player.tpm/player.tpa);
    playerRecord[7] = player.ftm.toString() + '-' + player.fta.toString();
    playerRecord[8] = toPercentage(player.ftm/player.fta);
    playerRecord[9] = player.oreb;
    playerRecord[10] = player.dreb;
    playerRecord[11] = player.reb;
    playerRecord[12] = player.ast;
    playerRecord[13] = player.stl;
    playerRecord[14] = player.blk;
    playerRecord[15] = player.tov;
    playerRecord[16] = player.pf;
    playerRecord[17] = player.pm !== undefined ? player.pm : '';
    playerRecord[18] = player.pts;

    return formatTableRow(playerRecord);
}

function formatMinutes(player) {
    if (player.memo)
        return player.memo;
    else if (player.status && player.status === 'I') {
        return 'Inactive';
    }
    if (player.min === undefined)
        return '';
    var min = player.min;
    var sec = player.sec;
    if (player.min.toString().length === 1) {
        min = '0' + player.min;
    }
    if (player.sec.toString().length === 1) {
        sec = '0' + player.sec;
    }
    return min + ':' + sec;
}

function toPercentage(decimal) {
    if (Number.isNaN(decimal))
        return '-';
    else
        return (decimal * 100).toFixed().toString() + '%';
}

function getScores(teamStats) {
    var result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    result[0] = teamStats.q1;
    result[1] = teamStats.q2;
    result[2] = teamStats.q3;
    result[3] = teamStats.q4;
    result[4] = teamStats.ot1;
    result[5] = teamStats.ot2;
    result[6] = teamStats.ot3;
    result[7] = teamStats.ot4;
    result[8] = teamStats.ot5;
    result[9] = teamStats.ot6;
    result[10] = teamStats.ot7;
    result[11] = teamStats.ot8;
    result[12] = teamStats.ot9;
    result[13] = teamStats.ot10;
    result[14] = teamStats.s;
    return result;
}

function highlightSummaryTable(){
    for (let i = 1;i < 16; i++) {   // [1...15]
        var vpts = parseInt($('#summary_box_score tbody tr:nth-child(2) td').eq(i).html());
        var hpts = parseInt($('#summary_box_score tbody tr:nth-child(3) td').eq(i).html());
        $('#summary_box_score tbody tr:nth-child(3) td').eq(i).removeClass(COLOR.RED);
        $('#summary_box_score tbody tr:nth-child(2) td').eq(i).removeClass(COLOR.RED);
        if (vpts > hpts){
            $('#summary_box_score tbody tr:nth-child(2) td').eq(i).addClass(COLOR.RED);
        } else if (vpts < hpts) {
            $('#summary_box_score tbody tr:nth-child(3) td').eq(i).addClass(COLOR.RED);
        }
    }
}

function highlightPlayerTable(){
    $('#away_box_score tbody tr:not(:first-child):not(:last-child)').each(function(index, el){
        highlightPlayerRowHelper(index, el);
    });

    $('#home_box_score tbody tr:not(:first-child):not(:last-child)').each(function(index, el){
        highlightPlayerRowHelper(index, el);
    });
}

function highlightPlayerRowHelper(index, el) {
    var children = $(el).children();
    if (!$(children[1]).html().includes(':') &&
         $(children[1]).html() !== 'Total') {
       $(el).addClass(COLOR.GRAY);
       return;
    }
    var fg = $(children[2]).html().split('-');
    var tp = $(children[4]).html().split('-');
    var ft = $(children[6]).html().split('-');
    if (parseInt(fg[1]) >= 5) {
        let percentage = parseInt(fg[0])/parseInt(fg[1]);
        if (percentage >= 0.6) {
            $(children[2]).addClass(COLOR.RED);
            $(children[3]).addClass(COLOR.RED);
        }
        else if (percentage <= 0.3) {
            $(children[2]).addClass(COLOR.GREEN);
            $(children[3]).addClass(COLOR.GREEN);
        }
    }

    if (parseInt(tp[1]) >= 5) {
        let percentage = parseInt(tp[0])/parseInt(tp[1]);
        if (percentage >= 0.6) {
            $(children[4]).addClass(COLOR.RED);
            $(children[5]).addClass(COLOR.RED);
        }
        else if (percentage <= 0.3) {
            $(children[4]).addClass(COLOR.GREEN);
            $(children[5]).addClass(COLOR.GREEN);
        }
    }

    if (parseInt(ft[1]) >= 5) {
        let percentage = parseInt(ft[0])/parseInt(ft[1]);
        if (percentage >= 0.85) {
            $(children[6]).addClass(COLOR.RED);
            $(children[7]).addClass(COLOR.RED);
        }
        else if (percentage <= 0.5) {
            $(children[6]).addClass(COLOR.GREEN);
            $(children[7]).addClass(COLOR.GREEN);
        }
    }

    var count = 0;
    var result = [];
    result.push($(children[10]));
    result.push($(children[11]));
    result.push($(children[12]));
    result.push($(children[13]));
    result.push($(children[14]));
    result.push($(children[17]));

    result.forEach(function(item, index){
        count += parseInt(item.html()) >= 10 ? 1 : 0;
    });
    if (parseInt(result[0].html()) >= 10)
        result[0].addClass(COLOR.RED);

    if (parseInt(result[1].html()) >= 10)
        result[1].addClass(COLOR.RED);

    if (parseInt(result[2].html()) >= 5)
        result[2].addClass(COLOR.RED);

    if (parseInt(result[3].html()) >= 5)
        result[3].addClass(COLOR.RED);

    if (parseInt(result[4].html()) === 0)
        result[4].addClass(COLOR.RED);
    else if (parseInt(result[4].html()) >= 5)
        result[4].addClass(COLOR.GREEN);

    if (parseInt(result[5].html()) >= 10)
        result[5].addClass(COLOR.RED);

    if (parseInt($(children[15]).html()) === 6)
        $(children[15]).addClass(COLOR.GREEN);

    if (count >= 3) {   // tri-db
        $(el).addClass(COLOR.BG_RED);
    } else if (count === 2) {   //db-db
        $(el).addClass(COLOR.BG_BLUE);
    }
}

function insertEmptyRows(){
    let item = ['','','00:00','0-0','0%','0-0','0%','0-0','0%',0,0,0,0,0,0,0,0,0,0];
    for (let i = 0; i < 15; i++) {
        $('#home_box_score').append(formatTableRow(item));
        $('#away_box_score').append(formatTableRow(item));
    }
}

function formatSummary(summary){
    $('#box .away-team-name').text(summary.atn);
    $('#box .home-team-name').text(summary.htn);
    $('#summary_box_score tbody tr:nth-child(2) td').eq(0).text(summary.ata);
    $('#summary_box_score tbody tr:nth-child(3) td').eq(0).text(summary.hta);
    $('#lead_changes').text(summary.lc);
    $('#times_tied').text(summary.tt);
    $('#arena').text(summary.an);
    $('#attendance').text(summary.at);
    $('#clock').text(formatClock(summary.cl, summary.stt));

    // $('#away_team_logo').html(summary.atlg);
    // $('#home_team_logo').html(summary.htlg);

    if (summary.rm) {
        $('#away_team_pts').text(summary.atpts).removeClass(COLOR.RED);
        $('#home_team_pts').text(summary.htpts).removeClass(COLOR.RED);
    } else {
        var away = $('#away_team_pts').text(summary.atpts).removeClass(COLOR.RED);
        var home = $('#home_team_pts').text(summary.htpts).removeClass(COLOR.RED);
        if (summary.atpts > summary.htpts) {
            away.addClass(COLOR.RED);
        } else if (summary.atpts < summary.htpts) {
            home.addClass(COLOR.RED);
        }
    }
}

// Fetch Data
function updateLastUpdate(ms) {
    var d;
    if (ms) {
        d = new Date(ms);
    } else {
        d = new Date();
    }
    var hour = d.getHours().toString();
    hour = hour.length === 1 ? '0' + hour : hour;
    var min = d.getMinutes().toString();
    min = min.length === 1 ? '0' + min : min;
    var sec = d.getSeconds().toString();
    sec = sec.length === 1 ? '0' + sec : sec;
    $("#lastUpdate").text('Last updated: ' + hour + ':' + min + ':' + sec);
}

function fetchData(fnSuccess, fnFail) {
    chrome.runtime.sendMessage({request : 'summary'}, function (data) {
        if (data && data.gs && data.gs.g && data.gs.g.length > 0) {
            var games = [];
            var gids = [];
            for (let i = 0; i < data.gs.g.length; i++){
                var game = data.gs.g[i];
                var card = formatCard(game);
                var gameObj = {
                    card : card,
                    gid : game.gid
                };
                gids.push(game.gid);
                if (validateLiveGame(game)) {
                    games.unshift(gameObj);
                } else {
                    games[i] = gameObj;
                }
             }

            // too big for sync, it only allows 8 bytes per item
            // sync also make the popup window weird
            chrome.storage.local.set({
                'popupRefreshTime' : new Date().getTime(),
                'cacheData' : games
            }, function(){
                if ($.isFunction(fnSuccess)){
                    fnSuccess(gids);
                }
            });

            updateLastUpdate();
            $("div").remove("." + UTILS.CARD);
            for (let key in games) {
                var obj = games[key];
                $("#cards").append($(obj.card).attr('gid', obj.gid));
            }
        } else {
            $("div").remove("." + UTILS.CARD);
            updateLastUpdate();
            $('#cards').append(NO_GAME_CARD);
            if ($.isFunction(fnFail)) {
                fnFail();
            }
        }
    });
}