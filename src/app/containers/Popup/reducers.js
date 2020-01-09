import types from './types'
import moment from 'moment-timezone'

const initState = {
    isLoading: true,
    games: [],
    lastUpdate: new Date(0),
}


const getBroadcasters = (casters) => {
    const national = (casters && casters.national)
    const canadian = (casters && casters.canadian)
    const home = (casters && casters.home)
    const visitor = (casters && casters.visitor)

    return national.concat(canadian).concat(home).concat(visitor)
}

// for http://data.nba.net/prod/v2/${dateStr}/scoreboard.json
// const sanitizeGame = game => ({
//     id: game.gameId,
//     // date: game.date,
//     date: game.startDateEastern,
//     // time: game.time,
//     time: game.startTimeEastern,
//     state: game.state,
//     arena: {
//         name: game.arena.name,
//         city: game.arena.city,
//     },
//     broadcasters: getBroadcasters(game.watch.broadcast.broadcasters),
//     home: game.hTeam,
//     visitor: game.vTeam,
//     playoffs: game.playoffs || {},
//     periodTime: {
//         // have not start
//         periodStatus: game.period.current === 1
//             ? moment.tz(`${game.date}${game.time}`, 'YYYYMMDDhhmm', 'America/New_York').local().format('hh:mm A')
//             : game.period.current,
//         gameClock: game.clock,
//         gameStatus: game.statusNum,
//         periodValue: game.period.current,
//     },
// })


// https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/2019/scores/00_todays_scores.json
const sanitizeGame = game => ({
    id: game.gid,
    // date: game.date,
    date: game.lm.gdate,
    // time: game.time,
    time: game.startTimeEastern,
    state: game.state,
    arena: {
        name: game.arena.name,
        city: game.arena.city,
    },
    broadcasters: getBroadcasters(game.watch.broadcast.broadcasters),
    home: game.hTeam,
    visitor: game.vTeam,
    playoffs: game.playoffs || {},
    periodTime: {
        // have not start
        periodStatus: game.p === 1
            ? moment.tz(`${game.lm}${game.time}`, 'YYYY-MM-DDhhmm', 'America/New_York').local().format('hh:mm A')
            : game.period.current,
        gameClock: game.cl,
        gameStatus: game.stt,
        periodValue: game.p,
    },
})


/**
 * Migrated from preprocessData()
 */
const sanitizeGames = games => {
    const sanitized = games.map(game => sanitizeGame(game))
    // eslint-disable-next-line no-console
    console.log(sanitized)
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
