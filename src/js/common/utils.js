'use strict';

const UTILS = {
    'TEAM_SCORE' : 'c-team-score',
    'TEAM_LOGO' : 'c-team-logo',
    'CLOCK' : 'c-clock',
    'TIME' : 'c-time',
    'MATCH_INFO' : 'c-match-info',
    'TEAM_INFO' : 'c-team-info',
    'TEAM_NAME' : 'c-team-name',
    'HYPHEN' : 'c-hyphen',
    'CARD' : 'c-card',

    'SELECTED' : 'u-selected',
    'OVERLAY' : 'over',
    'TABLE_CELL' : 'u-display-table-cell',
    'HIDE' : 'u-hide',
    'SHADOW' : 'u-shadow',
    'CENTER' : 'u-justify-center',
    'FLEX' : 'u-display-flex',
};

const COLOR = {
    'RED' : 'u-color-red',
    'GRAY' : 'u-color-gray',
    'GREEN' : 'u-color-green',
};

const BG_COLOR = {
    'BG_ORANGE' : 'u-background-orange',
    'BG_BLUE' : 'u-background-blue',
    'BG_PURPLE' : 'u-background-purple',
    'BG_GREEN' : 'u-background-green'
};

const AWAY_TEXT = 'Away';
const HOME_TEXT = 'Home';
const NO_GAME_TEXT = 'No Games Today &macr;\\_(&#12484;)_/&macr;';  //¯\_(ツ)_/¯
const NO_BOX_SCORE_TEXT = 'CLICK ON A GAME TO SEE THE BOX SCORE';
const FETCH_DATA_FAILED = 'Unable to fetch data';
const NON_LIVE_GAME = 'GAME HAS NOT STARTED YET';
const LOADING = 'LOADING...';
const VIEW_DETAILS = 'CLICK TO SEE BOX SCORE';


const getConfig = function() {
    return new Promise(function(resolve, reject) {
            chrome.storage.local.get(['nightMode', 'favTeam'], function(data) {
                if(data) {
                    resolve(data)
                } else {
                    reject(false)
                }
        })
    })
}
