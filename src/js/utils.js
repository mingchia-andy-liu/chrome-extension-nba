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
    'SLIDER' : 'c-loader',

    'SELECTED' : 'u-selected',
    'OVERLAY' : 'over',
    'TABLE_CELL' : 'u-display-table-cell',
    'HIDE' : 'u-hide',
    'SHADOW' : 'u-shadow',
    'CENTER' : 'u-justify-center',
    'FLEX' : 'u-display-flex',
    'SLIDE_BOUNCE' : 'u-sliding-bounce',
};

const COLOR = {
    'RED' : 'u-color-red',
    'GRAY' : 'u-color-gray',
    'GREEN' : 'u-color-green',
    'BG_ORANGE' : 'u-background-orange',
    'BG_BLUE' : 'u-background-blue',
    'BG_PURPLE' : 'u-background-purple',
    'BG_GREEN' : 'u-background-green'
};

const AWAY_TEXT = 'Away';
const HOME_TEXT = 'Home';
const HEADER_ROW = '<tr> <th></th> <th>Total</th> <th>FGM-A</th> <th>FG%</th> <th>3PM-A</th> <th>3P%</th> <th>FTM-A</th> <th>FT%</th> <th>OREB</th> <th>DREB</th> <th>REB</th> <th>AST</th> <th>STL</th> <th>BLK</th> <th>TOV</th> <th>PF</th> <th></th> <th>PTS</th> </tr>';
const NO_GAME_CARD = '<div class="c-card u-shadow u-justify-center u-align-center no-game">No Games Today ¯\\_(ツ)_/¯</div>';
const FETCH_DATA_FAILED = '<div class="c-card u-shadow u-justify-center u-align-center no-game">Unable to fetch data</div>';
const NO_BOX_SCORE_TEXT = '☜(ﾟヮﾟ☜) CLICK ON A GAME TO SEE THE BOX SCORE';
const NON_LIVE_GAME = 'GAME HAS NOT STARTED YET';
const LOADING = 'LOADING...';
const VIEW_DETAILS = 'CLICK TO SEE BOX SCORE';