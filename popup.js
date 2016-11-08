$(function(){

    $.ajax({
        type: "GET",
        contentType: "application/json",
        // headers: {'referer' : 'http://stats.nba.com/'},  // jquery rejects this
        // url: "http://stats.nba.com/stats/scoreboardV2?DayOffset=0&LeagueID=00&gameDate=11%2F07%2F2016"
        url: "http://data.nba.com/data/v2015/json/mobile_teams/nba/2016/scores/00_todays_scores.json"
    }).done(function( data ) {

        for (var i = 0; i < data.gs.g.length; i++){
            var game = data.gs.g[i];
            var teamAObj = game.v;
            var teamHObj = game.h;
            var rowA = formatRow(teamAObj);
            var rowH = formatRow(teamHObj);

            var gameCode = game.gcode;
            var gameURL = "https://watch.nba.com/game/" + gameCode; 
            var rowGameLink = "<tr><a href='" + gameURL + "'> <span style='display: block;'> NBA link</span> </a></tr>";

            var header = "<tr><th colspan='20'>" + "<span class='game_status'>" + game.stt + "</span>";
            if (game.cl != "00:00.0") {
                header += "<span class='clock'>" + game.cl + "</span>";
            } 
            header += "</th></tr>";
            var table = "<table class='box'>" + header + rowA + rowH + "</table>";

            $("#box_score_list").append(table);
            //$("#box_score_list").append(gameLink);  // require background.js
         }
    }).fail( function(xhr, textStatus, errorThrown) {
        alert(xhr.responseText);
        alert(textStatus);
    });


    var formatRow = function(teamObj) {
        var row =   "<td class='team_name'>" + teamObj.tn + "</td>" +
                    "<td>" + teamObj.q1 + "</td>" +
                    "<td>" + teamObj.q2 + "</td>" +
                    "<td>" + teamObj.q3 + "</td>" +
                    "<td>" + teamObj.q4 + "</td>";
        if (teamObj.ot1 !== 0)
            row += "<td>" + teamObj.ot1 + "</td>";
        if (teamObj.ot2 !== 0)
            row += "<td>" + teamObj.ot2 + "</td>";
        if (teamObj.ot3 !== 0)
            row += "<td>" + teamObj.ot3 + "</td>";
        if (teamObj.ot4 !== 0)
            row += "<td>" + teamObj.ot4 + "</td>";
        if (teamObj.ot5 !== 0)
            row += "<td>" + teamObj.ot5 + "</td>";
        if (teamObj.ot6 !== 0)
            row += "<td>" + teamObj.ot6 + "</td>";
        if (teamObj.ot7 !== 0)
            row += "<td>" + teamObj.ot7 + "</td>";
        if (teamObj.ot8 !== 0)
            row += "<td>" + teamObj.ot8 + "</td>";
        if (teamObj.ot9 !== 0)
            row += "<td>" + teamObj.ot9 + "</td>";
        if (teamObj.ot10 !== 0)
            row += "<td>" + teamObj.ot10 + "</td>";
        row += "<td class='final_score'>" + teamObj.s+ "</td>";

        return "<tr class='score_row'>" + row + "</tr>";
    };
});