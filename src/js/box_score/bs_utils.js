const EMPTY_PLAYER_ROW = ['', '00:00', '0-0', '-', '0-0', '-', '0-0', '-', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
const EMPTY_TEAM_ROW = ['', '','0-0', '-', '0-0', '-', '0-0', '-', '0', '0', '0', '0', '0', '0', '0', '0', '', '0' ];

// Summary table
function formatSummary(summary){
    let hLogoExist = false
    let vLogoExist = false
    LOGO_EXIST.forEach(function(item) {
        hLogoExist = hLogoExist || (item === summary.hta)
        vLogoExist = vLogoExist || (item === summary.ata)
    })
    if (hLogoExist){
        $('#home_team_logo .c-team-logo__svg').attr("src",`/src/assets/logo/${summary.hta}.svg`)
    } else {
        $('#home_team_logo .c-team-logo__svg').attr("src",'#')
    }

    if (vLogoExist) {
        $('#away_team_logo .c-team-logo__svg').attr("src",`/src/assets/logo/${summary.ata}.svg`)
    } else {
        $('#away_team_logo .c-team-logo__svg').attr("src",'#')
    }

    $('.away-team-name').text(summary.atn);
    $('.home-team-name').text(summary.htn);
    $('.summary-box-score tbody tr:nth-child(2) th').eq(0).text(summary.ata);
    $('.summary-box-score tbody tr:nth-child(3) th').eq(0).text(summary.hta);
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
        $('#away_team_pts').text(summary.atpts).removeClass(COLOR.GREEN);
        $('#home_team_pts').text(summary.htpts).removeClass(COLOR.GREEN);
    } else {
        var away = $('#away_team_pts').text(summary.atpts).removeClass(COLOR.GREEN);
        var home = $('#home_team_pts').text(summary.htpts).removeClass(COLOR.GREEN);
        if (summary.atpts > summary.htpts) {
            away.addClass(COLOR.GREEN);
        } else if (summary.atpts < summary.htpts) {
            home.addClass(COLOR.GREEN);
        }
    }
}


/**
 * Format Box score table's player minutes.
 * @param {row object} player
 *  @property {string} memo is the player status memo (injury)
 *  @property {string} status is the playing status. I for inactive. active otherwise
 *  @property {string} min is the minutes the player has played
 *
 * @returns {string} mm:ss format minutes OR status of the player
 */
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


/**
 * convert numerical decimal to percentage
 * @param {*} decimal
 *
 * @returns {string} 2 decimal percentage
 */
function toPercentage(decimal) {
    if (Number.isNaN(decimal))
        return '-';
    else
        return (decimal * 100).toFixed().toString() + '%';
}


/**
 * remove text/background color
 * @param {table row element} row
 */
function sanitizeTableRow(row){
    let rowEl = $(row);
    rowEl.attr('title', '');
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
    var fn = player && player.fn.trim() ? player.fn.charAt(0) + '.' : '';
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
        2 : [
            '',
            teamStats.fbpts,
            teamStats.bpts,
            teamStats.scp,
            teamStats.ble,
            teamStats.pip,
            teamStats.potov,
            // teamStats.tmreb,
            // teamStats.tmtov,
            // teamStats.tov,
            // teamStats.out,
        ]
    };
}

function highlightSummaryTable(){
    for (let i = 0;i < 16; i++) {   // [0...15]
        var vpts = parseInt($('.summary-box-score tbody tr:nth-child(2) td').eq(i).text());
        var hpts = parseInt($('.summary-box-score tbody tr:nth-child(3) td').eq(i).text());
        $('.summary-box-score tbody tr:nth-child(2) td').eq(i).removeClass(COLOR.GREEN);
        $('.summary-box-score tbody tr:nth-child(3) td').eq(i).removeClass(COLOR.GREEN);
        if (vpts > hpts){
            $('.summary-box-score tbody tr:nth-child(2) td').eq(i).addClass(COLOR.GREEN);
        } else if (vpts < hpts) {
            $('.summary-box-score tbody tr:nth-child(3) td').eq(i).addClass(COLOR.GREEN);
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

function highlightPlayerShootingStats(el, percentage, high, low) {
    if (percentage >= high) {
        $(el).addClass(COLOR.GREEN);
    } else if (percentage <= low) {
        $(el).addClass(COLOR.RED);
    }
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
        highlightPlayerShootingStats(children[2], percentage, 0.6, 0.3);
        highlightPlayerShootingStats(children[3], percentage, 0.6, 0.3);
    }

    if (parseInt(tp[1]) >= 5) {
        let percentage = parseInt(tp[0])/parseInt(tp[1]);
        highlightPlayerShootingStats(children[4], percentage, 0.6, 0.3);
        highlightPlayerShootingStats(children[5], percentage, 0.6, 0.3);
    }
    if (parseInt(ft[1]) >= 5) {
        let percentage = parseInt(ft[0])/parseInt(ft[1]);
        highlightPlayerShootingStats(children[6], percentage, 0.9, 0.5);
        highlightPlayerShootingStats(children[7], percentage, 0.9, 0.5);
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
    var doubles = '(';
    if (parseInt(result[0].text()) >= 10) {
        result[0].addClass(COLOR.GREEN);
        doubles += 'Rebounds';
    }

    if (parseInt(result[1].text()) >= 10) {
        result[1].addClass(COLOR.GREEN);
        if (doubles.length > 1) {
            doubles += ' + Assists';
        } else {
            doubles += 'Assists'
        }
    }

    if (parseInt(result[2].text()) >= 10) {
        if (doubles.length > 1) {
            doubles += ' + Steals';
        } else {
            doubles += 'Steals'
        }
    }
    if (parseInt(result[2].text()) >= 5)
        result[2].addClass(COLOR.GREEN);

    if (parseInt(result[3].text()) >= 10) {
        if (doubles.length > 1) {
            doubles += ' + Blocked Shots';
        } else {
            doubles += 'Blocked Shots'
        }
    }
    if (parseInt(result[3].text()) >= 5)
        result[3].addClass(COLOR.GREEN);

    if (parseInt(result[4].text()) === 0)
        result[4].addClass(COLOR.GREEN);
    else if (parseInt(result[4].text()) >= 5)
        result[4].addClass(COLOR.RED);

    if (parseInt(result[5].text()) >= 10) {
        result[5].addClass(COLOR.GREEN);
        doubles += ' + Points';
    }

    doubles += ')';
    if (parseInt($(children[15]).text()) === 6)
        $(children[15]).addClass(COLOR.RED);

    if (count === 3) {   // tri-db
        $(el).addClass(BG_COLOR.BG_ORANGE).attr('title', 'Triple Double! ' + doubles);
    } else if (count === 4) {
        $(el).addClass(BG_COLOR.BG_PURPLE).attr('title', 'Quadruple Double! ' + doubles);
    } else if (count === 2) {   //db-db
        $(el).addClass(BG_COLOR.BG_BLUE).attr('title', 'Double Double! ' + doubles);
    } else if (count === 5) {
        $(el).addClass(BG_COLOR.BG_GREEN).attr('title', 'Quintuple Double! ' + doubles);
    }
}
