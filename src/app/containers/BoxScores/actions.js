import fetch from 'node-fetch'
import types from './types'

export const fetchLiveGameBox = (dateStr, gid) => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })
        const base = 'https://data.nba.com/data/5s/json/cms/noseason/game'
        const bs = await fetch(`${base}/${dateStr}/${gid}/boxscore.json`)
        const pbp = await fetch(`${base}/${dateStr}/${gid}/pbp_all.json`)
        const { sports_content: { game: boxScoreData } } = await bs.json()
        const { sports_content: { game: pbpData } } = await pbp.json()
        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: {
                boxScoreData,
                pbpData,
            },
        })
    } catch (error) {
        dispatch({ type: types.REQUEST_ERROR })
    }
}

export const resetLiveGameBox = () => (dispatch) => {
    dispatch({ type: types.RESET })
}
