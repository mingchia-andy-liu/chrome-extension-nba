import fetch from 'node-fetch'
import types from './types'


const dataURL = 'https://data.nba.com/data/5s'
const base = `${dataURL}/json/cms/noseason/game`
const oldBase = `${dataURL}/v2015/json/mobile_teams/nba/2017/scores/gamedetail`

const isEmpty = (data) => (Object.keys(data).length === 0)

const fetchBoxScore = async (dateStr, gid) => {
    try {
        const bs = await fetch(`${base}/${dateStr}/${gid}/boxscore.json`)
        const { sports_content: { game: boxScoreData } } = await bs.json()
        return boxScoreData
    } catch (error) {
        return {}
    }
}

const fetchPBP = async (dateStr, gid) => {
    try {
        const pbp = await fetch(`${base}/${dateStr}/${gid}/pbp_all.json`)
        const { sports_content: { game: pbpData } } = await pbp.json()
        return pbpData
    } catch (error) {
        return {}
    }
}

const fetchGameDetail = async (dateStr, gid) => {
    try {
        const advanced = await fetch(`${oldBase}/${gid}_gamedetail.json`)
        const { g } = await advanced.json()
        return g
    } catch (error) {
        return {}
    }
}

export const fetchLiveGameBox = (dateStr, gid) => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })

        const boxScoreData = await fetchBoxScore(dateStr, gid)
        const pbpData = await fetchPBP(dateStr, gid)
        const g = await fetchGameDetail(dateStr, gid)

        if (isEmpty(boxScoreData) && isEmpty(pbpData) && isEmpty(g)) {
            throw Error()
        }

        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: {
                boxScoreData,
                pbpData,
                g,
            },
        })
    } catch (error) {
        dispatch({ type: types.REQUEST_ERROR })
    }
}

export const resetLiveGameBox = () => (dispatch) => {
    dispatch({ type: types.RESET })
}
