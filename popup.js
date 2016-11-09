var TEAM_SCORE = "c-team-score";
var HYPHEN = "c-hyphen";
var SCORE_BOARD = "c-score_board";
var CLOCK = "c-clock";
var MATCH_INFO = "c-match-info";
var TEAM_INFO = "c-team-info";
var CARD = "c-card";

$(function(){

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://data.nba.com/data/v2015/json/mobile_teams/nba/2016/scores/00_todays_scores.json"
    }).done(function( data ) {
        console.log(data);
        for (var i = 0; i < data.gs.g.length; i++){
            var game = data.gs.g[i];
            var card = formatCard(game);
            $("#box_score").append(card);
         }
    }).fail( function(xhr, textStatus, errorThrown) {
        console.log(xhr.responseText);
        console.log(textStatus);
    });


    function formatCard(match) {
            // score board
            var awayTeamScore = formatTag(match.v.s, "span", TEAM_SCORE);
            var hyphen = formatTag(" - ", "span", HYPHEN);
            var homeTeamScore = formatTag(match.h.s, "span", TEAM_SCORE);
            var scoreBoard = formatTag( awayTeamScore + hyphen + homeTeamScore, "div", SCORE_BOARD);
            
            //clock
            if (match.cl === '00:00.0'){
                var clock = formatTag(match.stt, "div", CLOCK);
            } else {
                var clock = formatTag(match.stt + " " + match.cl, "div", CLOCK);
            }

            //match info
            var matchInfo = formatTag(scoreBoard + clock, "div", MATCH_INFO);

            //team info
            var awayTeam = formatTag(match.v.tn, "div", TEAM_INFO);
            var homeTeam = formatTag(match.h.tn, "div", TEAM_INFO);

            //card
            var matchCard = formatTag(awayTeam+matchInfo+homeTeam, "div", CARD);
            return matchCard;
    }

    function formatTag(content, tag, className) {
        if (className) {
            return "<" + tag + " class='" + className + "'>" + content + "</" + tag + ">";
        } else {
            return "<" + tag + ">" + content + "</" + tag + ">";
        }
    }
});