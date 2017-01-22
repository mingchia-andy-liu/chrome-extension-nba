$(function(){
    'use strict';

    var SELECTED_GAME_OBJ = {};

    chrome.storage.local.get(['popupRefreshTime', 'cacheData'], function(data) {
        var cacheDate = data && data.popupRefreshTime ? data.popupRefreshTime : 0;
        var d = new Date();
        if (d.getTime() - cacheDate > 60000) {
            fetchData()
            .done(function(games){
                updateBox(getHash());
            })
            .fail(function(){
                removeBox();
                window.location.hash = '';
                $('.c-card:not(no-game)').each(function(index, el){
                    $(el).addClass('u-hide');
                });
                $('.no-game').removeClass('u-hide').text(FETCH_DATA_FAILED);
                $('.c-table .over p').html(FETCH_DATA_FAILED);
            });
        } else {
            updateLastUpdate(data.popupRefreshTime);
            updateCards(data.cacheData);
            updateBox(getHash());
        }
    });

    function getHash() {
        if (window.location.hash) {
            let gid = window.location.hash.substring(1);
            if (checkExistGame(gid)) {
                return gid;
            } else {
                return '';
            }
        }
    }

    function checkExistGame(gid) {
        let exist = false;
        $('#cards:not(.no-game)').children().each(function(index,el){
            if ($(el).attr('gid') === gid){
                $(el).addClass(UTILS.SELECTED);
                SELECTED_GAME_OBJ = $(el);
                exist = true;
            } else {
                $(el).removeClass(UTILS.SELECTED);
            }
        });
        if (!exist) {
            if (!$.isEmptyObject(SELECTED_GAME_OBJ)) {
                SELECTED_GAME_OBJ = {};
            }
            window.location.hash = '';
            $('.c-table .over p').html(NO_BOX_SCORE_TEXT);
        }
        return exist;
    }

    $('#cards:not(.no-game)').on("click", '.c-card', function() {
        if ($(this).is(SELECTED_GAME_OBJ)){
            return;
        }
        var gid = $(this).attr('gid');
        window.location.hash = '#' + gid;
        if (SELECTED_GAME_OBJ.removeClass) {
            SELECTED_GAME_OBJ.removeClass(UTILS.SELECTED);
        }
        SELECTED_GAME_OBJ = $(this).addClass(UTILS.SELECTED);
        $('.c-table .over').removeClass(UTILS.HIDE);
        $('.c-table .over p').text(LOADING);
        if (gid !== 0) {
            chrome.storage.local.get(['boxScore'], function(gameData) {
                var d = new Date().getTime();
                if (gameData && gameData.boxScore &&
                    gameData.boxScore[gid] &&
                    !$.isEmptyObject(gameData.boxScore[gid].data) &&
                    (gameData.boxScore[gid].time - d) < 60000) {
                    showBox(gameData.boxScore[gid].data);
                } else {
                    fetchBox(gid).done(function(boxScoreData){
                        showBox(boxScoreData);
                        var cacheData = {
                            boxScore : {}
                        };
                        cacheData.boxScore[gid] = {
                            data : boxScoreData,
                            time : d
                        };
                        chrome.storage.local.set(cacheData);
                    });
                }
            });
        }
    });

    function fetchBox(gid) {
        var deferred = $.Deferred();

        chrome.runtime.sendMessage({request : 'box_score', gid: gid}, function (data) {
            if (data && !data.g.stt.includes('ET')) {
                 data.g.vls.tstsg.pts = data.g.vls.s;
                 data.g.hls.tstsg.pts = data.g.hls.s;

                deferred.resolve(data.g);
            } else {
                deferred.resolve({});
            }
        });

        return deferred.promise();
    }

    function showBox(g) {
        if ($.isEmptyObject(g)) {
            removeBox();
            return;
        }
        checkExistGame(g.gid);
        $('.c-table .over').addClass(UTILS.HIDE);

        let summary = {
            atn : g.vls.tn,
            htn : g.hls.tn,
            ata : g.vls.ta,
            hta : g.hls.ta,
            aot1 : g.vls.ot1,
            hot1 : g.hls.ot1,
            cl : g.cl,
            stt : g.stt,
            atlg : g.vls.ta,
            htlg : g.hls.ta,
            atpts : g.vls.s,
            htpts : g.hls.s,
            rm : false
        };
        formatSummary(summary);

        // Update quarter scores in Summary Box Score
        $('.summary-box-score tbody tr:nth-child(2) >').each(function(index, el){
            if (index > 0 && index < 5) {
                let pts = g.vls['q' + index.toString()];
                $(el).text(pts);
            } else if (index > 4 && index < 15) {
                let otpts = g.vls['ot' + (index-4).toString()];
                if (otpts > 0){
                    $(el).text(otpts).removeClass('u-hide');
                } else {
                    $(el).text(0).addClass('u-hide');
                }
            } else if (index === 0) {
                return;
            } else if (index === 15) {
                $(el).text(g.vls.s);
                return;
            }
        });

        $('.summary-box-score tbody tr:nth-child(3) >').each(function(index, el){
            if (index > 0 && index < 5) {
                let pts = g.hls['q' + index.toString()];
                $(el).text(pts);
            } else if (index > 4 && index < 15) {
                let otpts = g.hls['ot' + (index-4).toString()];
                if (otpts > 0){
                    $(el).text(otpts).removeClass('u-hide');
                } else {
                    $(el).text(0).addClass('u-hide');
                }
            } else if (index === 0) {
                return;
            } else if (index === 15) {
                $(el).text(g.hls.s);
                return;
            }
        });

        $('.summary-box-score tbody tr:nth-child(1) >').each(function(index, el){
            if (index > 4 && index < 15) {
                let hotpts = g.hls['ot' + (index-4).toString()];
                let votpts = g.vls['ot' + (index-4).toString()];
                if (hotpts || votpts){
                    $(el).removeClass('u-hide');
                } else{
                    $(el).addClass('u-hide');
                }
            }
        });

        // Insert players to Player Box Score
        $('#away_box_score tbody tr:not(:first-child)').each(function(rowNum, el){
            sanitizeTableRow(el);
            if (g.vls.pstsg[rowNum]) {
                let rowData = formatBoxScoreData(g.vls.pstsg[rowNum]);
                $(el).show().children().each(function(col, cell){
                    $(cell).html(rowData[col]);
                });
                // if (g.vls.pstsg[rowNum].court) {
                //     $(el).find(">:first-child").css('background-color', '#fcd399');
                // }
            } else {
                $(el).hide();       // extra player row
            }
        });

       $('#away_box_score tbody tr:not(:first-child) :nth-child(2)').each(function(index, el){
            if ($(el).text().includes(':')){
                $(el).attr('colspan', 1).nextAll().each(function(index, next){
                    $(next).show(); //show upon switching games
                });
            } else {
                $(el).attr('colspan', 17);
                $(el).nextAll().each(function(index, next){
                    $(next).hide();
                });
            }
        });

       $('#home_box_score tbody tr:not(:first-child)').each(function(rowNum, el){
            sanitizeTableRow(el);
            if (g.hls.pstsg[rowNum]) {
                let rowData = formatBoxScoreData(g.hls.pstsg[rowNum]);
                $(el).show().children().each(function(col, cell){
                    $(cell).html(rowData[col]);
                });
                // if (g.vls.pstsg[rowNum].court) {
                //     $(el).find(">:first-child").css('background-color', '#fcd399');
                // }
            } else {
                $(el).hide();
            }
        });

       $('#home_box_score tbody tr:not(:first-child) :nth-child(2)').each(function(index, el){
            if ($(el).text().includes(':')){
                $(el).attr('colspan', 1).nextAll().each(function(index, next){
                    $(next).show();
                });
            } else {
                $(el).attr('colspan', 17);
                $(el).nextAll().each(function(index, next){
                    $(next).hide();
                });
            }
        });

        let cloned = $.extend({
            s:g.vls.s,
            out : g.vls.ftout + g.vls.stout
        }, g.vls.tstsg);

        var teamStatsRow = formatTeamStatsData(cloned);
        $('#away_team_stats tbody tr:nth-child(2)').children().each(function(index, el){
            $(el).text(teamStatsRow[1][index]);
        });

        $('.detail-box-score tbody tr:nth-child(2)').children().each(function(index, el){
            if (index === 0) {
                $(el).text(g.vls.ta);
            } else {
                $(el).text(teamStatsRow[2][index]);
            }
        });

        cloned = $.extend({
            s:g.hls.s,
            out : g.hls.ftout + g.hls.stout
        }, g.hls.tstsg);

        teamStatsRow = formatTeamStatsData(cloned);
        $('#home_team_stats tbody tr:nth-child(2)').children().each(function(index, el){
            $(el).text(teamStatsRow[1][index]);
        });
        $('.detail-box-score tbody tr:nth-child(3)').children().each(function(index, el){
            if (index === 0) {
                $(el).text(g.hls.ta);
            } else {
                $(el).text(teamStatsRow[2][index]);
            }
        });

        $('#lead_changes').text(g.gsts.lc);
        $('#times_tied').text(g.gsts.tt);


        // Highlight Summary Box Score for the winning qtrs
        highlightSummaryTable();

        // Highlight Player Box Score tri-db, db-db, and outstanding record cells
        highlightPlayerTable();
    }

    function removeBox() {
        $('.c-table .over').removeClass(UTILS.HIDE);
        if (!$.isEmptyObject(SELECTED_GAME_OBJ)){
            // $('.c-table .over p').text(NO_BOX_SCORE_TEXT);
        // } else {
            $('.c-table .over p').text(NON_LIVE_GAME);
        }

        let summary = {
            atn : AWAY_TEXT,
            htn : HOME_TEXT,
            ata : AWAY_TEXT,
            hta : HOME_TEXT,
            aot1 : 0,
            hot1 : 0,
            lc : 0,
            tt : 0,
            cl : null,
            stt : '',
            atlg : '',
            htlg : '',
            atpts : 0,
            htpts : 0,
            rm : true
        };
        formatSummary(summary);

        // Remove Summary Box's highlighting and hide all OTS
        $('.summary-box-score tbody tr:nth-child(1)').children().each(function(index, el){
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
        });
        $('.summary-box-score tbody tr:nth-child(2)').children().each(function(index, el){
            $(el).removeClass(COLOR.RED);
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
            if (index !== 0) {
                $(el).text(0);
            }
        });
        $('.summary-box-score tbody tr:nth-child(3)').children().each(function(index, el){
            $(el).removeClass(COLOR.RED);
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
            if (index !== 0) {
                $(el).text(0);
            }
        });

        // Insert empty rows so the table don't look too empty
        $('#away_box_score tbody tr:not(:first-child)').each(function(rowNum, row){
            sanitizeTableRow(row);
            $(row).children().each(function(colNum, cell){
                $(cell).text(EMPTY_PLAYER_ROW[colNum]).show().attr('colspan', 1);
            });
        });

        $('#away_team_stats tbody tr:nth-child(2)').children().each(function(index, el){
            $(el).text(EMPTY_TEAM_ROW[index]);
        });

        $('#home_box_score tbody tr:not(:first-child)').each(function(rowNum, row){
            sanitizeTableRow(row);
            $(row).children().each(function(colNum, cell){
                $(cell).text(EMPTY_PLAYER_ROW[colNum]).show().attr('colspan', 1);
            });
        });

        $('#home_team_stats tbody tr:nth-child(2)').children().each(function(index, el){
            $(el).text(EMPTY_TEAM_ROW[index]);
        });

        $('#away_team_logo').css('background-color','');
        $('#home_team_logo').css('background-color','');

    }

    function updateBox(gid) {
        if (gid) {
            fetchBox(gid).done(function(boxScoreData){
                showBox(boxScoreData);
                var cacheData = {
                    boxScore : {}
                };
                cacheData.boxScore[gid] = {
                    data : boxScoreData,
                    time : new Date().getTime()
                };
                chrome.storage.local.set(cacheData);
                checkExistGame(gid);
            });
        } else {
            removeBox();
        }
    }

    // alarm better than timeout
    chrome.alarms.onAlarm.addListener(function(alarm){
        // console.log(alarm.name);
        if (alarm.name === 'minuteAlarm') {
            fetchData()
            .done(function(gids){
                updateBox(getHash());
            })
            .fail(function(){
                removeBox();
                window.location.hash = '';
                $('.c-card:not(no-game)').each(function(index, el){
                    $(el).addClass('u-hide');
                });
                $('.no-game').removeClass('u-hide').text(FETCH_DATA_FAILED);
                $('.c-table .over p').html(FETCH_DATA_FAILED);
            });
        }
    });

    $('table').each(function(){
        $(this).tooltip({
          track: true,
          // /* work around https://bugs.jqueryui.com/ticket/10689 */
          create: function () { $(".ui-helper-hidden-accessible").remove(); }
        });
    });

    $('.tab').on('click', 'div', function(){
        if (this.id === 'away_tab') {
            $(this).addClass('active');
            $('#home_tab').removeClass('active');

            $('#away_tab_content').show();
            $('#home_tab_content').hide();
        } else if (this.id === 'home_tab') {
            $(this).addClass('active');
            $('#away_tab').removeClass('active');

            $('#home_tab_content').show();
            $('#away_tab_content').hide();
        }
    });

    $('#home_tab_content').css('display', 'none');
    $('.over').css('height', $('.c-table')[0].scrollHeight);
});