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
            // chrome.browserAction.setBadgeText({text: "live"});
            // chrome.browserAction.setBadgeBackgroundColor({color:"#FF0000"});
            return true;
        }
        // chrome.browserAction.setBadgeText({text: ""});
        return false;
    }


    function formatCard(match) {
            // score board
            var awayTeamScore = formatTag(match.v.s, 'span', [COMMON_UTIL.TEAM_SCORE]);
            var homeTeamScore = formatTag(match.h.s, 'span', [COMMON_UTIL.TEAM_SCORE]);
            if (match.stt === 'Final') {
                if (match.v.s > match.h.s)
                    awayTeamScore = formatTag(match.v.s, 'span', [COMMON_UTIL.TEAM_SCORE, COMMON_UTIL.TEXT_BOLD]);
                else
                    homeTeamScore = formatTag(match.h.s, 'span', [COMMON_UTIL.TEAM_SCORE, COMMON_UTIL.TEXT_BOLD]);
            }
            var hyphen = formatTag(' - ', 'span', [COMMON_UTIL.HYPHEN]);
            var scoreBoard = formatTag( awayTeamScore + hyphen + homeTeamScore, 'div', [COMMON_UTIL.SCORE_BOARD]);
            var clock = '';
            var showScore = true;

            // TODO: Normalize this logic
            if (match.cl === null || match.cl === '00:00.0'){
                if (!match.stt.includes('Qtr') && !match.stt.includes('Final') && !match.stt.includes('Halftime')){
                    var currDate = new Date();
                    var timeZoneOffset = currDate.getTimezoneOffset(); // returns in minute of the diff to UTC

                    var gameStatus = match.stt.split(' ');
                    var gameTime = gameStatus[0].split(':');
                    var gameHour = gameStatus[0].split(':')[0];
                    if (gameStatus[1] === 'pm') {
                        gameHour = parseInt(gameHour) + 12;
                    }
                    var gameTimezoneHour = gameHour + 5 - timeZoneOffset/60;
                    var timeFormat = 'am';
                    if (gameTimezoneHour > 12) {
                        timeFormat = 'pm';
                        gameTimezoneHour -= 12;
                    }
                    gameTimezoneHour = gameTimezoneHour.toString() + ':' + gameTime[1];

                    clock = formatTag('Today at ' + gameTimezoneHour + ' ' + timeFormat, 'div', [COMMON_UTIL.CLOCK]);
                    var at = formatTag('at', "div", [COMMON_UTIL.TEXT_ITALIC]);
                    clock += at;
                    showScore = false;
                } else {
                    clock = formatTag(match.stt, 'div', [COMMON_UTIL.CLOCK]);
                }
            } else {
                clock = formatTag(match.stt + ' ' + match.cl, 'div', [COMMON_UTIL.CLOCK]);
                var sliding_bar = formatTag('', 'div', [COMMON_UTIL.SLIDE_L_R]);
                clock += sliding_bar;
            }

            var gameURL = 'https://watch.nba.com/game/' + match.gcode;
            var gameLink = formatTag(gameURL, 'a', '','BOX score');

            //match info
            var matchInfoDetails = showScore ? scoreBoard + clock + gameLink : clock;
            var matchInfo = formatTag(matchInfoDetails, 'div', [COMMON_UTIL.MATCH_INFO]);

            //team info
            var awayTeamName = formatTag(match.v.tn, 'div');
            var awayTeamCity = formatTag(match.v.tc, 'div', [COMMON_UTIL.TEXT_ITALIC, COMMON_UTIL.TEAM_CITY, COMMON_UTIL.FONT_WEIGHT_NORMAL]);
            var awayTeamLogo = formatTag(LOGOS[match.v.ta], 'div', [COMMON_UTIL.TEAM_LOGO]);
            var awayTeam = formatTag(awayTeamLogo + awayTeamCity + awayTeamName , 'div', [COMMON_UTIL.TEAM_INFO]);
            var homeTeamName = formatTag(match.h.tn, 'div');
            var homeTeamCity = formatTag(match.h.tc, 'div', [COMMON_UTIL.TEXT_ITALIC, COMMON_UTIL.TEAM_CITY, COMMON_UTIL.FONT_WEIGHT_NORMAL]);
            var homeTeamLogo = formatTag(LOGOS[match.h.ta], 'div', [COMMON_UTIL.TEAM_LOGO]);
            var homeTeam = formatTag(homeTeamLogo + homeTeamCity + homeTeamName, 'div', [COMMON_UTIL.TEAM_INFO]);

            //card
            var matchCard = formatTag(awayTeam + matchInfo + homeTeam, 'div', [COMMON_UTIL.CARD, COMMON_UTIL.SHADOW]);
            return matchCard;
    }

    function formatTag(content, tag, className, text) {
        switch (tag){
            case 'div':
            case 'span':
                if(className && className.length > 0) {
                    var classNames = className.join(' ');
                    return '<' + tag + " class='" + classNames + "''>" + content + '</' + tag + '>';
                } else {
                    return '<' + tag + '>' + content + '</' + tag + '>';
                }
                break;
            case 'a':
                return   '<' + tag + " href='" + content + "'>" + text + '</a>';
            default:
                return '<div>OOPS, TAG NAME NOT FOUND></div>';
        }

    }
});
