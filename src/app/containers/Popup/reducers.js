/* eslint-disable no-console */
import types from './types'
import moment from 'moment-timezone'
import {convertDaily, convertDaily2} from '../../utils/convert'

const initState = {
    hasError: false,
    isLoading: true,
    games: [],
    lastUpdate: new Date(0),
}

// for http://data.nba.net/prod/v2/${dateStr}/scoreboard.json
const sanitizeGameFallBack2 = game => ({
    // gives home, visitor
    ...convertDaily2(game),
    id: game.gameId,
    date: game.startDateEastern,
    time: game.startTimeEastern,
    state: '',
    arena: {
        name: game.arena.name,
        city: game.arena.city,
    },
    playoffs: game.playoffs,
})

// https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2019/scores/00_todays_scores.json
const sanitizeGameFallBack = game => ({
    // gives home, visitor, periodTime,
    ...convertDaily(game),
    id: game.gid,
    date: game.gcode.split('/')[0] || '1970-01-01',
    time: '',
    state: game.st,
    arena: { name: '', city: '' },
    broadcasters: [],
    playoffs: game.playoffs,
})

const getBroadcasters = (casters) => {
    if (casters && casters.tv && casters.tv.broadcaster) {
        return casters.tv.broadcaster
    } else {
        return []
    }
}

const sanitizeGame = game => ({
    id: game.id,
    date: game.date,
    time: game.time,
    state: game.state,
    arena: {
        name: game.arena,
        city: game.city,
    },
    broadcasters: getBroadcasters(game.broadcasters),
    home: game.home,
    visitor: game.visitor,
    playoffs: game.playoffs,
    periodTime: {
        // have not start
        periodStatus: game.period_time.game_status === '1'
            ? moment.tz(`${game.date}${game.time}`, 'YYYYMMDDhhmm', 'America/New_York').local().format('hh:mm A')
            : game.period_time.period_status,
        gameClock: game.period_time.game_clock,
        gameStatus: game.period_time.game_status,
        periodValue: game.period_time.period_value,
    },
})

/**
 * Migrated from preprocessData()
 */
const sanitizeGames = (games, isFallBack = 0) => {
    const sanitized = games.map(game => {
        if (isFallBack === 1) {
            return sanitizeGameFallBack(game)
        } else if (isFallBack === 2) {
            return sanitizeGameFallBack2(game)
        } else {
            return sanitizeGame(game)
        }
    })
    const prepare = sanitized.filter(game => game && game.periodTime && game.periodTime.gameStatus == 1)
    const live = sanitized.filter(game => game && game.periodTime && game.periodTime.gameStatus == 2)
    const finish = sanitized.filter(game => game && game.periodTime && game.periodTime.gameStatus == 3)
    return live.concat(finish.concat(prepare))
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.REQUEST_START:
            return {
                ...state,
                hasError: false,
                isLoading: true,
            }
        case types.REQUEST_SUCCESS: {
            let games = action.payload
            const isFallBack = action.payload.isFallBack
            try {
                if (isFallBack === 1) {
                    games  = sanitizeGames(action.payload.games, isFallBack)
                } else if (isFallBack === 2) {
                    games  = sanitizeGames(action.payload.games, isFallBack)
                } else {
                    games = sanitizeGames(action.payload)
                }
            } catch (error) {
                games = []
            }
            return {
                games,
                hasError: false,
                isLoading: false,
                lastUpdate: new Date(),
            }
        }
        case types.REQUEST_ERROR: {
            return {
                games: [],
                hasError: true,
                isLoading: false,
                lastUpdate: new Date(0),
            }
        }
        default:
            return state
    }
}
