$(function () {
    'use strict';

    var COMMON_UTIL = {};
    var LOGOS = {};
    $.getJSON( '/src/common_utility/common_utility.json', function( data ) {
        COMMON_UTIL = data;
        LOGOS = data.LOGOS;
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.request === 'box_score') {
            fetchData(sendResponse);
        }
        return true;        // return true to tell google to use sendResponse asynchronously
    });


    chrome.alarms.create('minuteAlarm', {
        delayInMinutes : 1,
        periodInMinutes : 1
    });

    function fetchData(sendResponse) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2016/scores/00_todays_scores.json'
        }).done(function( data ) {
            var games = [];
            var result = {
                games : games
            };
            for (var i = 0; i < data.gs.g.length; i++){
                var game = data.gs.g[i];
                var card = formatCard(game);
                if (validateLiveGame(game)) {
                    games.unshift(card);
                } else {
                    games[i] = card;
                }
             }
             if (result.games.length === 0) {
                games[0] = formatTag('There is no game today. Try again tomorrow!', 'div', [COMMON_UTIL.CARD, COMMON_UTIL.SHADOW]);
             }
             sendResponse(result);
        }).fail( function(xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
            console.log(textStatus);
        });
    }

    function validateLiveGame(match) {
        if (match.cl && match.cl !== '00:00.0' && !match.stt.includes('Final')) {
            return true;
        }
        return false;
    }


    function formatCard(match) {
        // score board
        var awayTeamScore = formatTeamScore(match.v.s, match.v.s > match.h.s);
        var homeTeamScore = formatTeamScore(match.h.s, match.v.s < match.h.s);
        var hyphen = formatTag('-', 'div');
        var scoreBoardText = awayTeamScore + hyphen + homeTeamScore;
        var scoreBoard = formatTag( scoreBoardText, 'div', [COMMON_UTIL.FLEX]);
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
            var quarterStatus = match.stt.split(' ');
            var statusText = 'Q' + quarterStatus[0].charAt(0) + ' ' + match.cl;
            matchInfoDetails += formatClock(statusText);
            var slideBounce = formatTag('', 'div', [COMMON_UTIL.SLIDE_BOUNCE]);
            matchInfoDetails += formatTag(slideBounce, 'div', [COMMON_UTIL.SLIDER]);
        }

        //match info
        // var gameList = formatLinkTag('box-score.html', '', "/src/assets/vector/icon-list-black-48.svg");
        // var gameListDiv = formatTag(gameList, 'div', [COMMON_UTIL.LINK]);
        // var gameLink = formatLinkTag('https://watch.nba.com/game/' + match.gcode, '', "/src/assets/vector/icon-link-black-48.svg");
        // var gameLinkDiv = formatTag(gameLink, 'div', [COMMON_UTIL.LINK]);
        // var listDiv = formatTag(gameListDiv + gameLinkDiv, 'div', [COMMON_UTIL.FLEX, COMMON_UTIL.JUSTIFY_AROUND]);
        // matchInfoDetails += listDiv;
        var matchInfo = formatTag(matchInfoDetails, 'div', [COMMON_UTIL.MATCH_INFO]);

        //team info
        var awayTeam = formatTeamInfoTags(match.v.tn, match.v.tc + " (A)", LOGOS[match.v.ta]);
        var homeTeam = formatTeamInfoTags(match.h.tn, match.h.tc + " (H)", LOGOS[match.h.ta]);

        //card
        var matchCard = formatTag(awayTeam + matchInfo + homeTeam, 'div', [COMMON_UTIL.CARD, COMMON_UTIL.SHADOW]);
        return matchCard;
    }

    function formatTeamScore(score, winning) {
        if (winning) {
            return formatTag(score, 'span', [COMMON_UTIL.TEAM_SCORE, COMMON_UTIL.TEXT_SIZE_LARGE, COMMON_UTIL.TEXT_BOLD]);
        } else {
            return formatTag(score, 'span', [COMMON_UTIL.TEAM_SCORE]);
        }
    }

    function formatClock(text) {
        return formatTag(text, 'div', [COMMON_UTIL.CLOCK, COMMON_UTIL.TEXT_SIZE_SMALL]);
    }

    function formatTeamInfoTags(teamName, teamCity, teamLogo) {
        var team = formatTag(teamLogo, 'div', [COMMON_UTIL.TEAM_LOGO]);
        team += formatTag(teamCity, 'div', [COMMON_UTIL.TEXT_ITALIC, COMMON_UTIL.TEAM_CITY]);
        team += formatTag(teamName, 'div', [COMMON_UTIL.TEXT_BOLD, COMMON_UTIL.TEXT_SIZE_MEDIUM]);
        return formatTag(team, 'div', [COMMON_UTIL.TEAM_INFO]);
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
});
