import fetch from 'node-fetch'
import types from './types'

export const fetchPlayoff = () => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })

        const res = await fetch('https://data.nba.net/prod/v1/2018/playoffsBracket.json')
        const { series } = await res.json()

        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: series,
        })
    } catch (error) {
        dispatch({ type: types.REQUEST_ERROR })
    }
}
