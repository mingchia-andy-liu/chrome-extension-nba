import fetch from 'node-fetch'
import types from './types'

export const fetchStandings = () => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })

        const res = await fetch('https://stats.nba.com/stats/leaguestandingsv3?LeagueID=00&Season=2018-19&SeasonType=Regular+Season')
        const { resultSets } = await res.json()

        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: resultSets[0].rowSet,
        })
    } catch (error) {
        dispatch({ type: types.REQUEST_ERROR })
    }
}
