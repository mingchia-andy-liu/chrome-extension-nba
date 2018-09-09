import fetch from 'node-fetch'
import moment from 'moment'
import types from './types'

const dataURL = 'https://data.nba.com/data/5s'
const base = `${dataURL}/json/cms/noseason/game`
const oldBase = (year) => `${dataURL}/v2015/json/mobile_teams/nba/${year}/scores/gamedetail`

const isEmpty = (data) => (Object.keys(data).length === 0)

/* new API endpoint, sometimes it does not have data. Use old one instead
const fetchBoxScore = async (dateStr, gid) => {
    try {
        const bs = await fetch(`${base}/${dateStr}/${gid}/boxscore.json`)
        const { sports_content: { game: boxScoreData } } = await bs.json()
        return boxScoreData
    } catch (error) {
        return {}
    }
}
*/

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
        const year = moment(dateStr).isAfter('2018-09-01') ? '2018' : '2017'
        const advanced = await fetch(`${oldBase(year)}/${gid}_gamedetail.json`)
        const { g } = await advanced.json()
        return g
    } catch (error) {
        return {}
    }
}

export const fetchLiveGameBox = (dateStr, gid) => async (dispatch) => {
    try {
        dispatch({ type: types.REQUEST_START })

        // Promise all starts all the requests at the same time
        const [
            pbpData,
            boxScoreData
        ] = await Promise.all([
            fetchPBP(dateStr, gid),
            fetchGameDetail(dateStr, gid)
        ])

        if (isEmpty(boxScoreData) && isEmpty(pbpData)) {
            throw Error()
        }

        dispatch({
            type: types.REQUEST_SUCCESS,
            payload: {
                boxScoreData: boxScoreData,
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
