const EMPTY_PLAYER_ROW = ['', '00:00', '0-0', '-', '0-0', '-', '0-0', '-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
const EMPTY_TEAM_ROW = ['', '','0-0', '-', '0-0', '-', '0-0', '-', '0', '0', '0', '0', '0', '0', '0', '0', '', '0' ];

// Summary table
function formatSummary(summary){
    $('#away_team_logo').text(summary.atlg).css('background-color', LOGO_COLORS[summary.atlg]);
    $('#home_team_logo').text(summary.htlg).css('background-color', LOGO_COLORS[summary.htlg]);
    $('.away-team-name').text(summary.atn);
    $('.home-team-name').text(summary.htn);
    $('.summary-box-score tbody tr:nth-child(2) th').eq(0).text(summary.ata);
    $('.summary-box-score tbody tr:nth-child(3) th').eq(0).text(summary.hta);
    $('#lead_changes').text(summary.lc);
    $('#times_tied').text(summary.tt);
    if (summary.stt === 'Final') {
        if (summary.aot1 > 0 || summary.hot1 > 0) {
            $('.box-banner .c-time').text('Final/OT');
        } else {
            $('.box-banner .c-time').text('Final');
        }
    } else {
        $('.box-banner .c-time').text(formatClock(summary.cl, summary.stt));
    }


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

// Team table
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

function sanitizeTableRow(row){
    let rowEl = $(row);
    for (let color in BG_COLOR) {
        rowEl.removeClass(BG_COLOR[color]);
    }
    rowEl.removeClass(COLOR.GRAY);
    $(row).children().each(function(index, el){
        let cellEl = $(el);
        for (let color in COLOR) {
            cellEl.removeClass(COLOR[color]);
        }
    });
}

function formatBoxScoreData(player) {
    var playerRecord = [];
    var playerName = '';
    var fn = player && player.fn ? player.fn.charAt(0) + '.' : '';
    var ln = player.pos ? player.ln + (' ' + player.pos).sup() : player.ln;
    playerRecord.push(fn + ' ' + ln);
    playerRecord.push(formatMinutes(player));
    playerRecord.push(player.fgm.toString() + '-' + player.fga.toString());
    playerRecord.push(toPercentage(player.fgm/player.fga));
    playerRecord.push(player.tpm.toString() + '-' + player.tpa.toString());
    playerRecord.push(toPercentage(player.tpm/player.tpa));
    playerRecord.push(player.ftm.toString() + '-' + player.fta.toString());
    playerRecord.push(toPercentage(player.ftm/player.fta));
    playerRecord.push(player.oreb);
    playerRecord.push(player.dreb);
    playerRecord.push(player.reb);
    playerRecord.push(player.ast);
    playerRecord.push(player.stl);
    playerRecord.push(player.blk);
    playerRecord.push(player.tov);
    playerRecord.push(player.pf);
    playerRecord.push(player.pm !== undefined ? player.pm : '');
    playerRecord.push(player.pts);

    return playerRecord;
}

function formatTeamStatsData(teamStats) {
    return {
        1 : [
            '',
            '',
            teamStats.fgm.toString() + '-' + teamStats.fga.toString(),
            toPercentage(teamStats.fgm/teamStats.fga),
            teamStats.tpm.toString() + '-' + teamStats.tpa.toString(),
            toPercentage(teamStats.tpm/teamStats.tpa),
            teamStats.ftm.toString() + '-' + teamStats.fta.toString(),
            toPercentage(teamStats.ftm/teamStats.fta),
            teamStats.oreb.toString(),
            teamStats.dreb.toString(),
            teamStats.reb.toString(),
            teamStats.ast.toString(),
            teamStats.stl.toString(),
            teamStats.blk.toString(),
            teamStats.tov.toString(),
            teamStats.pf.toString(),
            '',
            teamStats.s.toString(),
        ],
        // 2 : ['', teamStats.tmreb, teamStats.ble, teamStats.fbpts, teamStats.tmtov, teamStats.tov, teamStats.potov, teamStats.out, teamStats.pip, teamStats.scp, teamStats.bpts ]
    };
}

function highlightSummaryTable(){
    for (let i = 1;i < 16; i++) {   // [1...15]
        var vpts = parseInt($('.summary-box-score tbody tr:nth-child(2) td').eq(i).text());
        var hpts = parseInt($('.summary-box-score tbody tr:nth-child(3) td').eq(i).text());
        $('.summary-box-score tbody tr:nth-child(2) td').eq(i).removeClass(COLOR.RED);
        $('.summary-box-score tbody tr:nth-child(3) td').eq(i).removeClass(COLOR.RED);
        if (vpts > hpts){
            $('.summary-box-score tbody tr:nth-child(2) td').eq(i).addClass(COLOR.RED);
        } else if (vpts < hpts) {
            $('.summary-box-score tbody tr:nth-child(3) td').eq(i).addClass(COLOR.RED);
        }
    }
}

function highlightPlayerTable(){
    $('#away_box_score tbody tr:not(:first-child)').each(function(index, el){
        highlightPlayerRowHelper(index, el);
    });

    $('#home_box_score tbody tr:not(:first-child)').each(function(index, el){
        highlightPlayerRowHelper(index, el);
    });
}

function highlightPlayerRowHelper(index, el) {
    var children = $(el).children();
    if (!$(children[1]).text().includes(':')) {
       $(el).addClass(COLOR.GRAY);
       return;
    }
    var fg = $(children[2]).text().split('-');
    var tp = $(children[4]).text().split('-');
    var ft = $(children[6]).text().split('-');
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
    } else if (parseInt(fg[1]) > 0 && parseInt(fg[0]) === 0){
            $(children[2]).addClass(COLOR.GREEN);
            $(children[3]).addClass(COLOR.GREEN);
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
    } else if (parseInt(tp[1]) > 0 && parseInt(tp[0]) === 0){
            $(children[4]).addClass(COLOR.GREEN);
            $(children[5]).addClass(COLOR.GREEN);
    }

    if (parseInt(ft[1]) >= 5) {
        let percentage = parseInt(ft[0])/parseInt(ft[1]);
        if (percentage >= 0.9) {
            $(children[6]).addClass(COLOR.RED);
            $(children[7]).addClass(COLOR.RED);
        }
        else if (percentage <= 0.5) {
            $(children[6]).addClass(COLOR.GREEN);
            $(children[7]).addClass(COLOR.GREEN);
        }
    } else if (parseInt(ft[1]) > 0 && parseInt(ft[0]) === 0){
            $(children[6]).addClass(COLOR.GREEN);
            $(children[7]).addClass(COLOR.GREEN);
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
        count += index !== 4 && parseInt(item.text()) >= 10 ? 1 : 0;
    });
    if (parseInt(result[0].text()) >= 10)
        result[0].addClass(COLOR.RED);

    if (parseInt(result[1].text()) >= 10)
        result[1].addClass(COLOR.RED);

    if (parseInt(result[2].text()) >= 5)
        result[2].addClass(COLOR.RED);

    if (parseInt(result[3].text()) >= 5)
        result[3].addClass(COLOR.RED);

    if (parseInt(result[4].text()) === 0)
        result[4].addClass(COLOR.RED);
    else if (parseInt(result[4].text()) >= 5)
        result[4].addClass(COLOR.GREEN);

    if (parseInt(result[5].text()) >= 10)
        result[5].addClass(COLOR.RED);

    if (parseInt($(children[15]).text()) === 6)
        $(children[15]).addClass(COLOR.GREEN);

    if (count === 3) {   // tri-db
        $(el).addClass(BG_COLOR.BG_ORANGE).attr('title', 'Triple Double!');
    } else if (count === 4) {
        $(el).addClass(BG_COLOR.BG_PURPLE).attr('title', 'Quadruple Double!');
    } else if (count === 2) {   //db-db
        $(el).addClass(BG_COLOR.BG_BLUE).attr('title', 'Double Double!');
    } else if (count === 5) {
        $(el).addClass(BG_COLOR.BG_GREEN).attr('title', 'Quintuple Double!');
    }
}