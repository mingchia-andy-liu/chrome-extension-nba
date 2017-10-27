$(function () {
    'use strict';

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.request === 'summary') {
            fetchGames(sendResponse);
        } else if (request.request === 'box_score') {
            fetchLiveGameBox(sendResponse, request.gid);
        } else if (request.request === 'schedule') {
            fetchFullSchedule(sendResponse)
        } else if (request.request === 'wakeup') {
            sendResponse('woken');
        }

        return true;        // return true to tell google to use sendResponse asynchronously
    });

    // this will reload the background explicitly to trigger an update as soon as possible if available
    chrome.runtime.onUpdateAvailable.addListener(function(details){
        console.log("updating to version " + details.version);
        chrome.runtime.reload();
    });

    chrome.runtime.onInstalled.addListener(function(details) {
        console.log('installed')
        chrome.runtime.openOptionsPage()
    });

    chrome.alarms.create('minuteAlarm', {
        delayInMinutes : 1,
        periodInMinutes : 1
    });

    chrome.alarms.create('scheduleAlarm', {
        delayInMinutes : 120,
        periodInMinutes : 120
    });

    function fetchGames(sendResponse) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json'
        }).done(function(data) {
            console.log(data);
            sendResponse(data);
            sendResponse(JSON.parse("{\"gs\":{\"mid\":1509081124897,\"gdte\":\"2017-10-26\",\"next\":\"http:\/\/data.nba.com\/data\/v2015\/json\/mobile_teams\/nba\/2017\/scores\/00_todays_scores\",\"g\":[{\"gid\":\"0021700068\",\"gcode\":\"20171026\/LACPOR\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"\",\"gres\":\"\",\"seri\":\"\",\"gid\":\"\"},\"v\":{\"ta\":\"LAC\",\"q1\":30,\"s\":104,\"q2\":32,\"q3\":18,\"q4\":24,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Clippers\",\"tc\":\"LA\",\"tid\":1610612746},\"h\":{\"ta\":\"POR\",\"q1\":24,\"s\":103,\"q2\":29,\"q3\":26,\"q4\":24,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Trail Blazers\",\"tc\":\"Portland\",\"tid\":1610612757}},{\"gid\":\"0021700065\",\"gcode\":\"20171026\/ATLCHI\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"\",\"gres\":\"\",\"seri\":\"\",\"gid\":\"\"},\"v\":{\"ta\":\"ATL\",\"q1\":20,\"s\":86,\"q2\":19,\"q3\":20,\"q4\":27,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Hawks\",\"tc\":\"Atlanta\",\"tid\":1610612737},\"h\":{\"ta\":\"CHI\",\"q1\":18,\"s\":91,\"q2\":19,\"q3\":28,\"q4\":26,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Bulls\",\"tc\":\"Chicago\",\"tid\":1610612741}},{\"gid\":\"0021700067\",\"gcode\":\"20171026\/BOSMIL\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"2017-10-18\",\"gres\":\"MIL won 100-108\",\"seri\":\"MIL leads series 1-0\",\"gid\":\"0021700007\"},\"v\":{\"ta\":\"BOS\",\"q1\":28,\"s\":96,\"q2\":15,\"q3\":29,\"q4\":24,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Celtics\",\"tc\":\"Boston\",\"tid\":1610612738},\"h\":{\"ta\":\"MIL\",\"q1\":23,\"s\":89,\"q2\":21,\"q3\":25,\"q4\":20,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Bucks\",\"tc\":\"Milwaukee\",\"tid\":1610612749}},{\"gid\":\"0021700066\",\"gcode\":\"20171026\/DALMEM\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"2017-10-25\",\"gres\":\"DAL won 103-94\",\"seri\":\"DAL leads series 1-0\",\"gid\":\"0021700061\"},\"v\":{\"ta\":\"DAL\",\"q1\":14,\"s\":91,\"q2\":21,\"q3\":33,\"q4\":23,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Mavericks\",\"tc\":\"Dallas\",\"tid\":1610612742},\"h\":{\"ta\":\"MEM\",\"q1\":28,\"s\":96,\"q2\":26,\"q3\":22,\"q4\":20,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Grizzlies\",\"tc\":\"Memphis\",\"tid\":1610612763}},{\"gid\":\"0021700069\",\"gcode\":\"20171026\/NOPSAC\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"\",\"gres\":\"\",\"seri\":\"\",\"gid\":\"\"},\"v\":{\"ta\":\"NOP\",\"q1\":27,\"s\":114,\"q2\":29,\"q3\":32,\"q4\":26,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Pelicans\",\"tc\":\"New Orleans\",\"tid\":1610612740},\"h\":{\"ta\":\"SAC\",\"q1\":40,\"s\":106,\"q2\":30,\"q3\":17,\"q4\":19,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Kings\",\"tc\":\"Sacramento\",\"tid\":1610612758}}]}}"))
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
            sendResponse({failed :true});
        });
    }

    function fetchLiveGameBox(sendResponse, gid) {
        $.ajax({
            type: 'GET',
            contentType:'application/json',
            url: `http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/scores/gamedetail/${gid}_gamedetail.json`
        }).done(function(data){
            sendResponse(data);
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
            sendResponse(null);
        });
    }

    function fetchFullSchedule(sendResponse) {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/league/00_full_schedule_week.json'
        }).done(function(data){
            sendResponse(data);
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
            sendResponse({failed: true});
        });
    }

    function initFetch() {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json'
        }).done(function(data) {
            console.log(data);
            chrome.storage.local.set({
                'popupRefreshTime' : new Date().getTime(),
                'cacheData' : JSON.parse("{\"gs\":{\"mid\":1509081124897,\"gdte\":\"2017-10-26\",\"next\":\"http:\/\/data.nba.com\/data\/v2015\/json\/mobile_teams\/nba\/2017\/scores\/00_todays_scores\",\"g\":[{\"gid\":\"0021700068\",\"gcode\":\"20171026\/LACPOR\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"\",\"gres\":\"\",\"seri\":\"\",\"gid\":\"\"},\"v\":{\"ta\":\"LAC\",\"q1\":30,\"s\":104,\"q2\":32,\"q3\":18,\"q4\":24,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Clippers\",\"tc\":\"LA\",\"tid\":1610612746},\"h\":{\"ta\":\"POR\",\"q1\":24,\"s\":103,\"q2\":29,\"q3\":26,\"q4\":24,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Trail Blazers\",\"tc\":\"Portland\",\"tid\":1610612757}},{\"gid\":\"0021700065\",\"gcode\":\"20171026\/ATLCHI\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"\",\"gres\":\"\",\"seri\":\"\",\"gid\":\"\"},\"v\":{\"ta\":\"ATL\",\"q1\":20,\"s\":86,\"q2\":19,\"q3\":20,\"q4\":27,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Hawks\",\"tc\":\"Atlanta\",\"tid\":1610612737},\"h\":{\"ta\":\"CHI\",\"q1\":18,\"s\":91,\"q2\":19,\"q3\":28,\"q4\":26,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Bulls\",\"tc\":\"Chicago\",\"tid\":1610612741}},{\"gid\":\"0021700067\",\"gcode\":\"20171026\/BOSMIL\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"2017-10-18\",\"gres\":\"MIL won 100-108\",\"seri\":\"MIL leads series 1-0\",\"gid\":\"0021700007\"},\"v\":{\"ta\":\"BOS\",\"q1\":28,\"s\":96,\"q2\":15,\"q3\":29,\"q4\":24,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Celtics\",\"tc\":\"Boston\",\"tid\":1610612738},\"h\":{\"ta\":\"MIL\",\"q1\":23,\"s\":89,\"q2\":21,\"q3\":25,\"q4\":20,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Bucks\",\"tc\":\"Milwaukee\",\"tid\":1610612749}},{\"gid\":\"0021700066\",\"gcode\":\"20171026\/DALMEM\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"2017-10-25\",\"gres\":\"DAL won 103-94\",\"seri\":\"DAL leads series 1-0\",\"gid\":\"0021700061\"},\"v\":{\"ta\":\"DAL\",\"q1\":14,\"s\":91,\"q2\":21,\"q3\":33,\"q4\":23,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Mavericks\",\"tc\":\"Dallas\",\"tid\":1610612742},\"h\":{\"ta\":\"MEM\",\"q1\":28,\"s\":96,\"q2\":26,\"q3\":22,\"q4\":20,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Grizzlies\",\"tc\":\"Memphis\",\"tid\":1610612763}},{\"gid\":\"0021700069\",\"gcode\":\"20171026\/NOPSAC\",\"p\":4,\"st\":3,\"stt\":\"Final\",\"cl\":\"00:00.0\",\"seq\":0,\"lm\":{\"gdte\":\"\",\"gres\":\"\",\"seri\":\"\",\"gid\":\"\"},\"v\":{\"ta\":\"NOP\",\"q1\":27,\"s\":114,\"q2\":29,\"q3\":32,\"q4\":26,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Pelicans\",\"tc\":\"New Orleans\",\"tid\":1610612740},\"h\":{\"ta\":\"SAC\",\"q1\":40,\"s\":106,\"q2\":30,\"q3\":17,\"q4\":19,\"ot1\":0,\"ot2\":0,\"ot3\":0,\"ot4\":0,\"ot5\":0,\"ot6\":0,\"ot7\":0,\"ot8\":0,\"ot9\":0,\"ot10\":0,\"tn\":\"Kings\",\"tc\":\"Sacramento\",\"tid\":1610612758}}]}}").gs.g,
                'fetchDataDate' : data.gs.gdte
            });
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
        })
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/league/00_full_schedule_week.json'
        }).done(function(data){
            chrome.storage.local.set({
                'schedule' : data,
                'scheduleRefreshTime' : new Date().getTime()
            })
        }).fail(function(xhr, textStatus, errorThrown) {
            console.log('Failed to fetch data.');
        });
    }
    initFetch()
});
