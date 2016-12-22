$(function(){
    'use strict';

    // chrome.storage.local.set({
    //     boxScore : {}
    // });
    var SHOWN_GAME = 0;

    chrome.storage.local.get(['popupRefreshTime', 'cacheData'], function(data) {
        if (!data.popupRefreshTime) {
            fetchData();
        } else {
            var d = new Date();
            var diff = (d.getTime() - data.popupRefreshTime);
            if (diff > 60000) { // cache expired
                fetchData();
            } else {
                d = new Date(data.popupRefreshTime);
                var hour = d.getHours().toString();
                hour = hour.length === 1 ? '0' + hour : hour;
                var min = d.getMinutes().toString();
                min = min.length === 1 ? '0' + min : min;
                var sec = d.getSeconds().toString();
                sec = sec.length === 1 ? '0' + sec : sec;
                $("#lastUpdate").text('Last fetched: ' + hour + ':' + min + ':' + sec);
                $("div").remove("." + UTILS.CARD);
                for (var key in data.cacheData) {
                    var obj = data.cacheData[key];
                    $('#cards').append($(obj.card).attr('gid', obj.gid));
                }
            }
        }
    });

    $('#cards').on("click", '> *', function() {
        var gid = $(this).attr('gid');
        // console.log(gid);
        SHOWN_GAME = gid;
        if (gid !== 0) {
            chrome.storage.local.get(['boxScore'], function(gameData) {
                var d = new Date().getTime();
                if (gameData.boxScore[gid] &&
                    !$.isEmptyObject(gameData.boxScore[gid].data) &&
                    (gameData.boxScore[gid].time - d) < 60000) {
                    showBox(gameData.boxScore[gid].data);
                } else {
                    fetchBox(gid).done(function(boxScoreData){
                        showBox(boxScoreData);
                        gameData.boxScore[gid] = {
                            data : boxScoreData,
                            time : d
                        };
                        chrome.storage.local.set(gameData);
                    });
                }
            });
        }
    });

    function fetchData() {
        chrome.runtime.sendMessage({request : 'summary'}, function (data) {
            var games = [];
            if (data) {
                if (data.gs.g.length === 0) {
                    games[0] = {
                        card : NO_GAME_CARD,
                        gid : 0
                    };
                } else {
                    for (var i = 0; i < data.gs.g.length; i++){
                        var game = data.gs.g[i];
                        var gameObj = {};
                        var card = formatCard(game);
                        gameObj.card = card;
                        gameObj.gid = game.gid;
                        // gameObj.gid = i%2 ? game.gid : '0021600410';
                        if (validateLiveGame(game)) {
                            games.unshift(gameObj);
                        } else {
                            games[i] = gameObj;
                        }
                     }
                }

                var d = new Date();
                var hour = d.getHours().toString();
                hour = hour.length === 1 ? '0' + hour : hour;
                var min = d.getMinutes().toString();
                min = min.length === 1 ? '0' + min : min;
                var sec = d.getSeconds().toString();
                sec = sec.length === 1 ? '0' + sec : sec;
                $("#lastUpdate").text('Last fetched: ' + hour + ':' + min + ':' + sec);
                $("div").remove("." + UTILS.CARD);
                for (var key in games) {
                    var obj = games[key];
                    $('#cards').append($(obj.card).attr('gid', obj.gid));
                }

                if (SHOWN_GAME !== 0) {
                    fetchBox(SHOWN_GAME).done(function(boxScoreData){
                        showBox(boxScoreData);
                        var cacheData = {
                            boxScore : {}
                        };
                        cacheData.boxScore[SHOWN_GAME] = {
                            data : boxScoreData,
                            time : d.getTime()
                        };
                        chrome.storage.local.set(cacheData);
                    });
                }

                chrome.storage.local.set({
                    'popupRefreshTime' : new Date().getTime(),
                    'cacheData' : games
                });
            } else {
                $("div").remove("." + UTILS.CARD);
                $("#lastUpdate").text('Last fetched: --:--:--');
                $('#cards').append($(NO_GAME_CARD));
                removeBox();
            }
        });
    }

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
        // console.log(g);
        if ($.isEmptyObject(g)) {
            removeBox();
            return;
        }
        let summary = {
            atn : g.vls.tn,
            htn : g.hls.tn,
            ata : g.vls.ta,
            hta : g.hls.ta,
            lc : g.gsts.lc,
            tt : g.gsts.tt,
            an : g.an,
            at : g.at,
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
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).removeClass(UTILS.HIDE);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).removeClass(UTILS.HIDE);
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).addClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).addClass(UTILS.TABLE_CELL);
            } else if (index + 1 > 4){
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).removeClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).removeClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).addClass(UTILS.HIDE);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).addClass(UTILS.HIDE);
            }
        });
        getScores(g.hls).forEach(function(item, index){
            $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).text(item);
            if (item > 0 && index + 1 > 4) {
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).removeClass(UTILS.HIDE);
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).addClass(UTILS.TABLE_CELL);
            } else if (index + 1 > 4) {
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).removeClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).addClass(UTILS.HIDE);
            }
        });

        // Insert players to Player Box Score
        $('#away_box_score tbody').children('tr:not(:first)').remove();
        g.vls.pstsg.forEach(function(item){
            $('#away_box_score').append(formatBoxScoreData(item));
        });
        $('#away_box_score').append(formatBoxScoreData(g.vls.tstsg));

        $('#home_box_score tbody').children('tr:not(:first)').remove();
        g.hls.pstsg.forEach(function(item) {
            $('#home_box_score').append(formatBoxScoreData(item));
        });
        $('#home_box_score').append(formatBoxScoreData(g.hls.tstsg));


        // Highlight Summary Box Score for the winning qtrs
        highlightSummaryTable();

        // Highlight Player Box Score tri-db, db-db, and outstanding record cells
        highlightPlayerTable();
    }

    function removeBox() {
        let summary = {
            atn : AWAY_TEXT,
            htn : HOME_TEXT,
            ata : AWAY_TEXT,
            hta : HOME_TEXT,
            lc : 0,
            tt : 0,
            an : '-',
            at : 0,
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
            $(el).removeClass('u-color-red');
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
            if (index !== 0) {
                $(el).text(0);
            }
        });
        $('#summary_box_score tbody tr:nth-child(3)').children().each(function(index, el){
            $(el).removeClass('u-color-red');
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

    // alarm better than timeout
    chrome.alarms.onAlarm.addListener(function(alarm){
        if (alarm.name === 'minuteAlarm') {
            fetchData();
        }
    });
});