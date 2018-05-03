import fetch from 'node-fetch'
import types from './types'

export const fetchLiveGameBox = (gid) => async (dispatch) => {
    try {
        console.log('[LiveGameBox] start')
        dispatch({ type: types.REQUEST_START })
        const res = await fetch(`https://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/gamedetail/${gid}_gamedetail.json`)
        const data = await res.json()
        console.log('[LiveGameBox] success', data)
        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: data.g
        })
    } catch (error) {
        console.log('[LiveGameBox] error', error)
        dispatch({ type: types.REQUEST_ERROR })
    }
}

export const fetchPlayByPlay = (gid) => async (dispatch) => {
    try {
        console.log('[Playbyplay] start')
        dispatch({ type: types.PBP_REQUEST_START })
        const res = await fetch(`https://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/pbp/${gid}_full_pbp.json`)
        const data = await res.json()
        console.log('[Playbyplay] success', data)
        dispatch({
            type: types.PBP_REQUEST_SUCCESS,
            payload: data.g
        })
    } catch (error) {
        console.log('[Playbyplay] error', error)
        dispatch({ type: types.PBP_REQUEST_ERROR })
    }
}
