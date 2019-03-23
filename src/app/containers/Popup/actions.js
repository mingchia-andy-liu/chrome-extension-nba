import moment from 'moment'
import types from './types'
import getApiDate from '../../utils/getApiDate'
import { DATE_FORMAT } from '../../utils/constant'
import { checkLiveGame } from '../../utils/browser'

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
        // has the UI been shown yet, if so, don't show the loading spinner
        if (!isBackground) {
            dispatch({ type: types.REQUEST_START })
        }

        const games = await fetchRequest(dateStr)
        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: games,
        })
        if (moment(getApiDate()).format(DATE_FORMAT) === dateStr) {
            checkLiveGame(games)
        }
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

export const fetchGamesIfNeeded = (dateStr, callback, forceUpdate = false, isBackground = null) => async (dispatch, getState) => {
    const { live: { games, lastUpdate }, date: { date } } = getState()
    const oldDateStr = moment(date).format(DATE_FORMAT)
    const updateDiff = moment().diff(lastUpdate, 'seconds')

    // if it's different day, or force update, fetch new
    if (oldDateStr === dateStr && !forceUpdate) {
        const hasPendingOrLiveGame = games.find(game =>
            game.periodTime && game.periodTime.gameStatus !== '3'
        )

        if (!hasPendingOrLiveGame || updateDiff < 55) {
            return
        }
    }

    isBackground = isBackground === false ? false : oldDateStr === dateStr
    return await fetchGames(dispatch, dateStr, callback, isBackground)
}
