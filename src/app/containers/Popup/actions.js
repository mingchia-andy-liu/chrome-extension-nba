import types from './types'

/**
 * Migrate from background.js `fetchGames`
 */

export const fetchGames = (dateStr) => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })

        const res = await fetch(`https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`)
        const {
            sports_content: {
                games:  { game },
            },
        } = await res.json()
        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: game,
        })
    } catch (error) {
        console.log('[FetchLiveGames] fetch error', error)
        dispatch({ type: types.REQUEST_ERROR })
    }
}
