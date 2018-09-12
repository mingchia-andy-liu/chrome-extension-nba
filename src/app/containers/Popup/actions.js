import types from './types'

/**
 * Migrate from background.js `fetchGames`
 */

/**
 * Fetch games to provided date
 * @param {string} dateStr selected date in string format
 * @param {function} callback callback to see if the 'id' in the URL is valid
 */
export const fetchGames = (dateStr, callback) => async (dispatch) => {
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
    const res = await fetch(`https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`)
    const { sports_content: { games: { game } } } = await res.json()
    return game
}
