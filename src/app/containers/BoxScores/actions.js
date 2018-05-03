import fetch from 'node-fetch'
import types from './types'

export const fetchLiveGameBox = (gid) => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })
        const res = await fetch(`https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2017/scores/gamedetail/${gid}_gamedetail.json`)
        const data = await res.json()
        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({ type: types.REQUEST_ERROR })
    }
}
