$(function(){
    'use strict';

    var SELECTED_GAME_OBJ = {};

    chrome.storage.local.get(['popupRefreshTime', 'cacheData'], function(data) {
        if (!data.popupRefreshTime) {
            fetchData(updateBox, removeBox);
        } else {
            var d = new Date();
            var diff = (d.getTime() - data.popupRefreshTime);
            if (diff > 60000) { // cache expired
                fetchData(updateBox, removeBox);
            } else {
                updateLastUpdate(data.popupRefreshTime);
                $("div").remove("." + UTILS.CARD);
                for (var key in data.cacheData) {
                    var obj = data.cacheData[key];
                    $('#cards').append($(obj.card).attr('gid', obj.gid));
                }
            }
        }
    });

    $('#cards').on("click", '.c-card', function() {
        var gid = $(this).attr('gid');
        if (SELECTED_GAME_OBJ.attr && SELECTED_GAME_OBJ.attr('gid') === gid)
            return;
        if (SELECTED_GAME_OBJ.removeClass) {
            SELECTED_GAME_OBJ.removeClass(UTILS.SELECTED);
        }
        SELECTED_GAME_OBJ = $(this);
        $('#overlay').addClass(UTILS.OVERLAY);
        $('#overlay p').text(LOADING);
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
        $('#overlay').removeClass(UTILS.OVERLAY);

        $('#cards').children().each(function(index,el){
            if ($(el).attr('gid') === g.gid){
                $(el).addClass(UTILS.SELECTED);
                SELECTED_GAME_OBJ = $(el);
            }
        });

        let summary = {
            atn : g.vls.tn,
            htn : g.hls.tn,
            ata : g.vls.ta,
            hta : g.hls.ta,
            lc : g.gsts.lc,
            tt : g.gsts.tt,
            cl : g.cl,
            stt : g.stt,
            atlg : $(formatTag(LOGOS[g.vls.ta], 'div', [UTILS.TEAM_LOGO])),
            htlg : $(formatTag(LOGOS[g.hls.ta], 'div', [UTILS.TEAM_LOGO])),
            atpts : g.vls.s,
            htpts : g.hls.s,
            rm : false
        };
        formatSummary(summary);

        // Update quarter scores in Summary Box Score
        getScores(g.vls).forEach(function(item, index){
            $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).text(item);
            if (item > 0 && index + 1 > 4) {
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).removeClass(UTILS.HIDE).addClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).removeClass(UTILS.HIDE).addClass(UTILS.TABLE_CELL);
                // $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).addClass(UTILS.TABLE_CELL);
                // $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).addClass(UTILS.TABLE_CELL);
            } else if (index + 1 > 4 && index + 1 < 15){
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).removeClass(UTILS.TABLE_CELL).addClass(UTILS.HIDE);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).removeClass(UTILS.TABLE_CELL).addClass(UTILS.HIDE);
                // $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).addClass(UTILS.HIDE);
                // $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).addClass(UTILS.HIDE);
            }
        });
        getScores(g.hls).forEach(function(item, index){
            $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).text(item);
            if (item > 0 && index + 1 > 4) {
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).removeClass(UTILS.HIDE).addClass(UTILS.TABLE_CELL);
                // $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).addClass(UTILS.TABLE_CELL);
            } else if (index + 1 > 4 && index + 1 < 15) {
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).removeClass(UTILS.TABLE_CELL).addClass(UTILS.HIDE);
                // $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).addClass(UTILS.HIDE);
            }
        });

        // Insert players to Player Box Score
        $('#away_box_score tbody').children('tr:not(:first)').remove();
        g.vls.pstsg.forEach(function(item){
            $('#away_box_score').append(formatBoxScoreData(item));
        });
        $('#away_box_score').append(HEADER_ROW).append(formatBoxScoreData(g.vls.tstsg));
        // $('#away_box_score').append(formatBoxScoreData(g.vls.tstsg));

        $('#home_box_score tbody').children('tr:not(:first)').remove();
        g.hls.pstsg.forEach(function(item) {
            $('#home_box_score').append(formatBoxScoreData(item));
        });
        $('#home_box_score').append(HEADER_ROW).append(formatBoxScoreData(g.hls.tstsg));
        // $('#home_box_score').append(formatBoxScoreData(g.hls.tstsg));


        // Highlight Summary Box Score for the winning qtrs
        highlightSummaryTable();

        // Highlight Player Box Score tri-db, db-db, and outstanding record cells
        highlightPlayerTable();
    }

    function removeBox() {
        $('#overlay').addClass(UTILS.OVERLAY);
        $('#overlay p').text(NO_BOX_SCORE_TEXT);
        let summary = {
            atn : AWAY_TEXT,
            htn : HOME_TEXT,
            ata : AWAY_TEXT,
            hta : HOME_TEXT,
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
        $('#summary_box_score tbody tr:nth-child(1)').children().each(function(index, el){
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
        });
        $('#summary_box_score tbody tr:nth-child(2)').children().each(function(index, el){
            $(el).removeClass(COLOR.RED);
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
            if (index !== 0) {
                $(el).text(0);
            }
        });
        $('#summary_box_score tbody tr:nth-child(3)').children().each(function(index, el){
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
        $('#home_box_score tbody').children('tr:not(:first)').remove();
        $('#away_box_score tbody').children('tr:not(:first)').remove();
        insertEmptyRows();
    }

    function updateBox(gids) {
        var gameID = 0 || (SELECTED_GAME_OBJ.attr && SELECTED_GAME_OBJ.attr('gid'));
        if (gameID !== 0 && gids.indexOf(gameID) !== -1) {
            fetchBox(gameID).done(function(boxScoreData){
                showBox(boxScoreData);
                var cacheData = {
                    boxScore : {}
                };
                cacheData.boxScore[gameID] = {
                    data : boxScoreData,
                    time : new Date().getTime()
                };
                chrome.storage.local.set(cacheData);
            });
        } else {
            removeBox();
        }
    }

    // alarm better than timeout
    chrome.alarms.onAlarm.addListener(function(alarm){
        if (alarm.name === 'minuteAlarm') {
            fetchData(updateBox, removeBox);
        }
    });
});