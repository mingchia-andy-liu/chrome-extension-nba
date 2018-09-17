import moment from 'moment'
import types from './types'
import {store} from '../../store'

/**
 * Migrate from background.js `fetchGames`
 */

/**
 * Fetch games to provided date
 * @param {string} dateStr selected date in string format
 * @param {function} callback callback to see if the 'id' in the URL is valid
 */
const fetchGames = async (dispatch, dateStr, callback) => {
    try {
        dispatch({ type: types.REQUEST_START })

        const games = await fetchRequest(dateStr)
        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: games,
        })
        if (callback) callback(games)
    } catch (error) {
        if (callback) callback([])
        dispatch({ type: types.REQUEST_ERROR })
    }
}

export const fetchRequest = async (dateStr) => {
    try {
        const res = await fetch(`https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`)
        const { sports_content: { games: { game } } } = await res.json()
        return game
    } catch (error) {
        return []
    }
}

export const fetchGamesIfNeeded = (dateStr, callback, forceUpdate = false) => async (dispatch) => {
    const { live: { games }, date: { date } } = store.getState()
    const oldDateStr = moment(date).format('YYYYMMDD')
    if (oldDateStr === dateStr && !forceUpdate) {
        const hasPendingOrLiveGame = games.find(game =>
            game.period_time && game.period_time.game_status !== '3'
        )
        if (!hasPendingOrLiveGame) {
            return games
        }
    }

    return await fetchGames(dispatch, dateStr, callback)
}
