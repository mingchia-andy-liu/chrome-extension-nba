import types from './types'

/**
 * Migrate from background.js `fetchGames`
 */

export const fetchGames = (redirectPath, originalPath) => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })

        const res = await fetch(`https://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json`)
        const data = await res.json()
        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: data.gs
        })
    } catch (error) {
        console.log('[FetchLiveGames] fetch error', error)
        dispatch({ type: types.REQUEST_ERROR })
    }
}
