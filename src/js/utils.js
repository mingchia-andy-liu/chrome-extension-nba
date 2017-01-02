'use strict';

const UTILS = {
    'TEAM_SCORE' : 'c-team-score',
    'TEAM_LOGO' : 'c-team-logo',
    'CLOCK' : 'c-clock',
    'MATCH_INFO' : 'c-match-info',
    'TEAM_INFO' : 'c-team-info',
    'TEAM_CITY' : 'c-team-city',
    'TEAM_NAME' : 'c-team-name',
    'HYPHEN' : 'c-hyphen',
    'CARD' : 'c-card',
    'LINK' : 'c-link',
    'SLIDER' : 'c-loader',

    'SELECTED' : 'u-selected',
    'OVERLAY' : 'u-overlay',
    'TABLE_CELL' : 'u-display-table-cell',
    'HIDE' : 'u-hide',
    'SHADOW' : 'u-shadow',
    'CENTER' : 'u-justify-center',
    'FLEX' : 'u-display-flex',
    'JUSTIFY_AROUND' : 'u-justify-around',
    'SLIDE_BOUNCE' : 'u-sliding-bounce',
    'TEXT_BOLDER' : 'u-text-bolder',
    'TEXT_ITALIC' : 'u-text-italic',
    'TEXT_SIZE_LARGE' : 'u-text-size-large',
    'TEXT_SIZE_MEDIUM' : 'u-text-size-medium',
    'TEXT_SIZE_SMALL' : 'u-text-size-small',
    'FONT_WEIGHT_NORMAL' : 'u-font-weight-normal'
};

const COLOR = {
    'RED' : 'u-color-red',
    'GRAY' : 'u-color-gray',
    'GREEN' : 'u-color-green',
    'BG_RED' : 'u-background-red',
    'BG_BLUE' : 'u-background-blue',
};

const AWAY_TEXT = 'Away';
const HOME_TEXT = 'Home';
const HEADER_ROW = '<tr> <th></th> <th>Total</th> <th>FGM-A</th> <th>FG%</th> <th>3PM-A</th> <th>3P%</th> <th>FTM-A</th> <th>FT%</th> <th>OREB</th> <th>DREB</th> <th>REB</th> <th>AST</th> <th>STL</th> <th>BLK</th> <th>TOV</th> <th>PF</th> <th></th> <th>PTS</th> </tr>';
const NO_GAME_CARD = '<div class="c-card u-shadow u-text-size-larger u-justify-center u-align-center">No Games Today ¯\\_(ツ)_/¯</div>';
