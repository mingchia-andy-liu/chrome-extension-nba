import fetch from 'node-fetch'
import moment from 'moment'
import types from './types'
import getAPIDate from '../../utils/getApiDate'
import { DATE_FORMAT } from '../../utils/constant'

const dataURL = 'https://data.nba.com/data/10s'
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

const fetchLiveGameBox = async (dispatch, dateStr, gid, isBackground) => {
    try {
        // has the UI been shown yet, if so, don't show the loading spinner
        if (!isBackground) {
            dispatch({ type: types.REQUEST_START })
        }

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
                boxScoreData,
                gid,
                pbpData,
            },
        })
    } catch (error) {
        dispatch({ type: types.REQUEST_ERROR })
    }
}

export const fetchLiveGameBoxIfNeeded = (dateStr, gid, isBackground = null) => async (dispatch, getState) => {
    if (gid == null || gid === '') {
        return
    }

    const apiDate = getAPIDate()
    // if the date is in the future, then exit early
    if (moment(dateStr).isAfter(apiDate)) {
        return
    }

    const {
        bs: {
            bsData,
            gid: oldGid,
        },
        date: { date },
        live: { lastUpdate },
    } = getState()
    const oldDateStr = moment(date).format(DATE_FORMAT)
    const updateDiff = moment().diff(lastUpdate, 'seconds')

    // if it's different day and different id, fetch new
    if (oldDateStr === dateStr && oldGid === gid) {
        // if it's same game but the game is finished, use old
        // if it's less than 60 seconds from the last update, use old
        if ((bsData.periodTime && bsData.periodTime.gameStatus === '3') || updateDiff < 55) {
            return
        }
    }
    // make sure to show the loading screen when in didUpdate()
    isBackground = isBackground === false ? false : oldGid === gid
    return await fetchLiveGameBox(dispatch, dateStr, gid, isBackground)
}

export const resetLiveGameBox = () => (dispatch) => {
    dispatch({ type: types.RESET })
}
