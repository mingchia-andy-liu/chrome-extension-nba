$(function () {
    'use strict';

    var TEAM_SCORE = "c-team-score";
    var HYPHEN = "c-hyphen";
    var SCORE_BOARD = "c-score_board";
    var CLOCK = "c-clock";
    var MATCH_INFO = "c-match-info";
    var TEAM_INFO = "c-team-info";
    var CARD = "c-card";
    var SHADOW = "u-shadow";
    var SLIDE_L_R = "u-sliding-l-r";

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.request === 'box_score') {
            fetchData(sendResponse);
        }
        return true;        // return true to tell google to use sendResponse asynchronously
    });

    function fetchData(sendResponse) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://data.nba.com/data/v2015/json/mobile_teams/nba/2016/scores/00_todays_scores.json"
        }).done(function( data ) {
            var games = {};
            var result = {
                games : games
            };
            // TODO: figure out a better way to send the date as well
            for (var i = 0; i < data.gs.g.length; i++){
                var game = data.gs.g[i];
                var card = formatCard(game);
                games[i] = card;
             }
             sendResponse(result);
        }).fail( function(xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
            console.log(textStatus);
        });
    }

    function formatCard(match) {
            // score board
            var awayTeamScore = formatTag(match.v.s, "span", [TEAM_SCORE]);
            var hyphen = formatTag(" - ", "span", [HYPHEN]);
            var homeTeamScore = formatTag(match.h.s, "span", [TEAM_SCORE]);
            var scoreBoard = formatTag( awayTeamScore + hyphen + homeTeamScore, "div", [SCORE_BOARD]);
            var clock = '';
            if (match.cl === null || match.cl === '00:00.0'){
                clock = formatTag(match.stt, "div", [CLOCK]);
            } else {
                clock = formatTag(match.stt + " " + match.cl, "div", [CLOCK]);
                var sliding_bar = formatTag("", "div", [SLIDE_L_R]);
                clock += sliding_bar;
            }

            var gameURL = "https://watch.nba.com/game/" + match.gcode;
            var gameLink = formatTag(gameURL, "a", "","NBA game link");

            //match info
            var matchInfo = formatTag(scoreBoard + clock + gameLink, "div", [MATCH_INFO]);

            //team info
            var awayTeam = formatTag(match.v.tn, "div", [TEAM_INFO]);
            var homeTeam = formatTag(match.h.tn, "div", [TEAM_INFO]);

            //card
            var matchCard = formatTag(awayTeam + matchInfo + homeTeam, "div", [CARD, SHADOW]);
            return matchCard;
    }

    function formatTag(content, tag, className, text) {
        switch (tag){
            case 'div':
            case 'span':
                if(className) {
                    var classNames = className.join(' ');
                    return "<" + tag + " class='" + classNames + "'>" + content + "</" + tag + ">";
                } else {
                    return "<" + tag + ">" + content + "</" + tag + ">";
                }
                break;
            case 'a':
                console.log("<" + tag + "href='" + content + "'>" + text + "</a>");
                return   "<" + tag + " href='" + content + "'>" + text + "</a>";
            default:
                return "<div>OOPS, TAG NAME NOT FOUND></div>";
        }

    }
});
