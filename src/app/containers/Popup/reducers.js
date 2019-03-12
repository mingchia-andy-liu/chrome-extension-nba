import types from './types'
import moment from 'moment-timezone'

const initState = {
    isLoading: true,
    games: [],
    lastUpdate: new Date(0),
}

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
const sanitizeGames = games => {
    const sanitized = games.map(game => sanitizeGame(game))
    const prepare = sanitized.filter(game => game && game.periodTime && game.periodTime.gameStatus === '1')
    const live = sanitized.filter(game => game && game.periodTime && game.periodTime.gameStatus === '2')
    const finish = sanitized.filter(game => game && game.periodTime && game.periodTime.gameStatus === '3')
    return live.concat(finish.concat(prepare))
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.REQUEST_START:
            return {
                ...state,
                isLoading: true,
            }
        case types.REQUEST_SUCCESS:
            return {
                ...state,
                games: sanitizeGames(action.payload),
                isLoading: false,
                lastUpdate: new Date(),
            }
        case types.REQUEST_ERROR:
            return {
                ...state,
                games: [],
                isLoading: false,
                lastUpdate: new Date(0),
            }
        default:
            return state
    }
}
