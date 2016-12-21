$(function(){
    'use strict';

    // chrome.storage.local.set({
    //     boxScore : {}
    // });
    var SHOWN_GAME = 0;

    $('#cards').on("click", '> *', function() {
        var gid = $(this).attr('gid');
        // console.log(gid);
        SHOWN_GAME = gid;
        chrome.storage.local.get(['boxScore'], function(gameData) {
            var d = new Date().getTime();
            if (gameData.boxScore[gid] && (gameData.boxScore[gid].time - d) < 60000) {
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
    });

    function fetchData() {
        chrome.runtime.sendMessage({request : 'summary'}, function (data) {
            if (data) {
                var games = [];
                if (data.gs.g.length === 0) {
                    games[0] = formatTag('There is no game today. Try again tomorrow!', 'div', [UTILS.CARD, UTILS.SHADOW]);
                } else {
                    for (var i = 0; i < data.gs.g.length; i++){
                        var game = data.gs.g[i];
                        var gameObj = {};
                        var card = formatCard(game);
                        gameObj.card = card;
                        gameObj.gid = game.gid;
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
                $("#timer").text('Last fetched: ' + hour + ':' + min);
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
        $('#box .away-team-name').text(g.vls.tn);
        $('#box .home-team-name').text(g.hls.tn);
        $('#lead_changes').text(g.gsts.lc);
        $('#times_tied').text(g.gsts.tt);
        $('#arena').text(g.an);
        $('#attendance').text(g.at);
        $('#summary_box_score tbody tr:nth-child(2) td').eq(0).text(g.vls.ta);
        $('#summary_box_score tbody tr:nth-child(3) td').eq(0).text(g.hls.ta);

        $('#away_team_pts').text(g.vls.s);
        $('#home_team_pts').text(g.hls.s);
        if (g.vls.s > g.hls.s) {
            $('#away_team_pts').addClass('u-color-red');
            $('#home_team_pts').removeClass('u-color-red');
        } else {
            $('#home_team_pts').addClass('u-color-red');
            $('#away_team_pts').removeClass('u-color-red');
        }
        $('#away_team_logo').html($(formatTag(LOGOS[g.vls.ta], 'div', [UTILS.TEAM_LOGO])));
        $('#home_team_logo').html($(formatTag(LOGOS[g.hls.ta], 'div', [UTILS.TEAM_LOGO])));

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

        getScores(g.vls).forEach(function(item, index){
            $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).text(item);
            if (item > 0) {
                if (index + 1 > 4) {
                    $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).removeClass(UTILS.HIDE);
                    $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).removeClass(UTILS.HIDE);
                    $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).addClass(UTILS.TABLE_CELL);
                    $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).addClass(UTILS.TABLE_CELL);
                }
            } else if (index + 1 > 4){
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).removeClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).removeClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(1) th').eq(index + 1).addClass(UTILS.HIDE);
                $('#summary_box_score tbody tr:nth-child(2) td').eq(index + 1).addClass(UTILS.HIDE);
            }
        });
        getScores(g.hls).forEach(function(item, index){
            $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).text(item);
            if (item > 0) {
                if (index + 1 > 4) {
                    $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).removeClass(UTILS.HIDE);
                    $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).addClass(UTILS.TABLE_CELL);
                }
            } else if (index + 1 > 4) {
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).removeClass(UTILS.TABLE_CELL);
                $('#summary_box_score tbody tr:nth-child(3) td').eq(index + 1).addClass(UTILS.HIDE);
            }
        });

        for (let i = 1;i < 16; i++) {
            var vpts = parseInt($('#summary_box_score tbody tr:nth-child(2) td').eq(i).html());
            var hpts = parseInt($('#summary_box_score tbody tr:nth-child(3) td').eq(i).html());
            $('#summary_box_score tbody tr:nth-child(3) td').eq(i).removeClass('u-color-red');
            $('#summary_box_score tbody tr:nth-child(2) td').eq(i).removeClass('u-color-red');
            if (vpts > hpts){
                $('#summary_box_score tbody tr:nth-child(2) td').eq(i).addClass('u-color-red');
            } else if (vpts < hpts) {
                $('#summary_box_score tbody tr:nth-child(3) td').eq(i).addClass('u-color-red');
            }
        }

        highlightTable();
    }

    function removeBox() {
        $('#box .away-team-name').text(AWAY_TEXT);
        $('#box .home-team-name').text(HOME_TEXT);
        $('#lead_changes').text(0);
        $('#times_tied').text(0);
        $('#arena').text('-');
        $('#attendance').text(0);
        $('#home_box_score tbody').children('tr:not(:first)').remove();
        $('#away_box_score tbody').children('tr:not(:first)').remove();
        $('#summary_box_score tbody').children(':nth-child(1)').children().each(function(index, el){
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
        });
        $('#summary_box_score tbody').children(':nth-child(2)').children().each(function(index, el){
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
            if (index === 0) {
                $(el).text(AWAY_TEXT);
            } else {
                $(el).text(0);
            }
        });
        $('#summary_box_score tbody').children(':nth-child(3)').children().each(function(index, el){
            if (index > 4 && index < 14){
                $(el).removeClass(UTILS.TABLE_CELL);
                $(el).addClass(UTILS.HIDE);
            }
            if (index === 0) {
                $(el).text(HOME_TEXT);
            } else {
                $(el).text(0);
            }
        });
    }

    // alarm better than timeout
    chrome.alarms.onAlarm.addListener(function(alarm){
        if (alarm.name === 'minuteAlarm') {
            fetchData();
        }
    });

    chrome.storage.local.get(['popupRefreshTime', 'cacheData'], function(data) {
        if (!data.popupRefreshTime) {
            fetchData();
        } else {
            var d = new Date();
            var diff = (d.getTime() - data.popupRefreshTime);
            if (diff > 60000) {
                fetchData();
            } else {
                var hour = d.getHours().toString();
                hour = hour.length === 1 ? '0' + hour : hour;
                var min = d.getMinutes().toString();
                min = min.length === 1 ? '0' + min : min;
                $("#timer").text('Last fetched: ' + hour + ':' + min);
                $("div").remove("." + UTILS.CARD);
                for (var key in data.cacheData) {
                    var obj = data.cacheData[key];
                    $('#cards').append($(obj.card).attr('gid', obj.gid));
                }
            }
        }
    });
});