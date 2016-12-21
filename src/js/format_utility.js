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
    var hyphen = formatTag('-', 'div');
    var scoreBoardText = awayTeamScore + hyphen + homeTeamScore;
    var scoreBoard = formatTag( scoreBoardText, 'div', [UTILS.FLEX]);
    var matchInfoDetails = '';

    if ((match.stt.includes('Qtr') && match.cl === '00:00.0')||
        match.stt === 'Final' ||
        match.stt === 'Halftime') {
        matchInfoDetails += scoreBoard;
        matchInfoDetails += formatClock(match.stt);
    } else if (match.cl === null || match.cl === '00:00.0'){
        var currDate = new Date();
        // returns in minute of the diff to UTC
        var timeZoneOffset = currDate.getTimezoneOffset();

        var gameStatus = match.stt.split(' ');  // 12:00 pm ET
        var gameTime = gameStatus[0].split(':');
        var gameHour = gameTime[0];
        if (gameStatus[1] === 'pm') {
            gameHour = parseInt(gameHour) + 12;
        }
        var gameTimezoneHour = gameHour + 5 - timeZoneOffset/60;
        var timeFormat = 'am';
        if (gameTimezoneHour >= 12) {
            timeFormat = 'pm';
        }
        if (gameTimezoneHour > 12){
            gameTimezoneHour -= 12;
        }
        // hour + minute
        gameTimezoneHour = gameTimezoneHour.toString() + ':' + gameTime[1];

        //  local game time
        matchInfoDetails += formatClock(gameTimezoneHour + ' ' + timeFormat);
    } else {
        // clock + sliding bar while it's live
        matchInfoDetails += scoreBoard;

        var statusText = match.stt;
        if (match.stt.includes('Qtr')) {
            var quarterStatus = match.stt.split(' ');
            statusText = 'Q' + quarterStatus[0].charAt(0) + ' ' + match.cl;
        } else if (match.stt.includes('OT')) {
            var otStatus = match.stt.split(' ');
            statusText = 'OT' + otStatus[0].charAt(0) + ' ' + match.cl;
        }
        matchInfoDetails += formatClock(statusText);
        var slideBounce = formatTag('', 'div', [UTILS.SLIDE_BOUNCE]);
        matchInfoDetails += formatTag(slideBounce, 'div', [UTILS.SLIDER]);
    }

    //match info
    // var gameList = formatLinkTag('box-score.html', '', "/src/assets/vector/icon-list-black-48.svg");
    // var gameListDiv = formatTag(gameList, 'div', [UTILS.LINK]);
    // var gameLink = formatLinkTag('https://watch.nba.com/game/' + match.gcode, '', "/src/assets/vector/icon-link-black-48.svg");
    // var gameLinkDiv = formatTag(gameLink, 'div', [UTILS.LINK]);
    // var listDiv = formatTag(gameListDiv + gameLinkDiv, 'div', [UTILS.FLEX, UTILS.JUSTIFY_AROUND]);
    // matchInfoDetails += listDiv;
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
        return formatTag(score, 'span', [UTILS.TEAM_SCORE, UTILS.TEXT_SIZE_LARGE, UTILS.TEXT_BOLD]);
    } else {
        return formatTag(score, 'span', [UTILS.TEAM_SCORE]);
    }
}

function formatClock(text) {
    return formatTag(text, 'div', [UTILS.CLOCK, UTILS.TEXT_SIZE_SMALL]);
}

function formatTeamInfoTags(teamName, teamCity, teamLogo) {
    var team = formatTag(teamLogo, 'div', [UTILS.TEAM_LOGO]);
    team += formatTag(teamCity, 'div', [UTILS.TEXT_ITALIC, UTILS.TEAM_CITY]);
    team += formatTag(teamName, 'div', [UTILS.TEXT_BOLD, UTILS.TEXT_SIZE_MEDIUM]);
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
        if (data[0] !== '' || data[1] !== '') {
            result += '<td>' + data[0] + '<br>' + data[1] + '</td>';
        } else {
            result += '<td></td>';
        }
        for (let i = 2; i < data.length; i++) {
            result += '<td>' + data[i] + '</td>';
        }
    }
    result = '<tr>' + result + '</tr>';
    return result;
}

function formatBoxScoreData(player) {
    var playerRecord = ['','','00:00',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    playerRecord[0] = player.fn || playerRecord[0];
    playerRecord[1] = player.ln || playerRecord[1];
    playerRecord[2] = formatMinutes(player.min, player.sec);
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

function formatMinutes(minutes, secodns) {
    if (minutes === undefined)
        return '';
    var min = minutes;
    var sec = secodns;
    if (minutes.toString().length === 1) {
        min = '0' + minutes;
    }
    if (secodns.toString().length === 1) {
        sec = '0' + secodns;
    }
    return min + ':' + sec;
}

function toPercentage(decimal) {
    if (Number.isNaN(decimal))
        return '0%';
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


function highlightTable(){
    $('#away_box_score tbody tr:not(:first-child):not(:last-child)').each(function(index, el){
        highlightRowHelper(index, el);
    });

    $('#home_box_score tbody tr:not(:first-child):not(:last-child)').each(function(index, el){
        highlightRowHelper(index, el);
    });
}

function highlightRowHelper(index, el){
        var count = 0;
        var result = [];
        result.push($(el).children().eq(10));
        result.push($(el).children().eq(11));
        result.push($(el).children().eq(12));
        result.push($(el).children().eq(13));
        result.push($(el).children().eq(14));
        result.push($(el).children().eq(17));

        result.forEach(function(item, index){
            count += parseInt(item.html()) >= 10 ? 1 : 0;
        });
        if (parseInt(result[0].html()) >= 10)
            result[0].addClass('u-color-red');

        if (parseInt(result[1].html()) >= 10)
            result[1].addClass('u-color-red');

        if (parseInt(result[2].html()) >= 5)
            result[2].addClass('u-color-red');

        if (parseInt(result[3].html()) >= 5)
            result[3].addClass('u-color-red');

        if (parseInt(result[4].html()) === 0)
            result[4].addClass('u-color-red');
        else if (parseInt(result[4].html()) > 5)
            result[4].addClass('u-color-green');

        if (parseInt(result[5].html()) >= 10)
            result[5].addClass('u-color-red');

        if (parseInt($(el).children().eq(15).html()) === 6)
            $(el).children().eq(15).addClass('u-color-green');


        if (count >= 3) {
            $(el).addClass('u-background-red');
        } else if (count === 2) {
            $(el).addClass('u-background-blue');
        }
}