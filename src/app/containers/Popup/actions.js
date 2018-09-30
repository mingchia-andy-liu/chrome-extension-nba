import moment from 'moment'
import types from './types'
import {DATE_FORMAT} from '../../utils/format'

/**
 * Migrate from background.js `fetchGames`
 */

/**
 * Fetch games to provided date
 * @param {string} dateStr selected date in string format
 * @param {function} callback callback to see if the 'id' in the URL is valid
 */
const fetchGames = async (dispatch, dateStr, callback, isBackground) => {
    try {
        if (!isBackground) {
            dispatch({ type: types.REQUEST_START })
        }

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

export const fetchGamesIfNeeded = (dateStr, callback, forceUpdate = false) => async (dispatch, getState) => {
    const { live: { games, lastUpdate }, date: { date } } = getState()
    const oldDateStr = moment(date).format(DATE_FORMAT)
    const updateDiff = moment().diff(lastUpdate, 'seconds')

    // if it's different day, or force update, fetch new
    if (oldDateStr === dateStr && !forceUpdate) {
        const hasPendingOrLiveGame = games.find(game =>
            game.periodTime && game.periodTime.gameStatus !== '3'
        )

        if (!hasPendingOrLiveGame || updateDiff < 60) {
            return
        }
    }

    return await fetchGames(dispatch, dateStr, callback, oldDateStr === dateStr )
}
