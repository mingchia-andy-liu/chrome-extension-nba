import { push } from 'react-router-redux'
import fetch from 'node-fetch'
import moment from 'moment'
import types from './types'
import getAPIDate from '../../utils/getApiDate'
import { DATE_FORMAT } from '../../utils/constant'
import { waitUntilFinish } from '../../utils/common'

const dataURL = 'https://data.nba.com/data/10s'
const base = `${dataURL}/json/cms/noseason/game`
const oldBase = (year, leagueSlug) => `${dataURL}/v2015/json/mobile_teams/${leagueSlug}/${year}/scores/gamedetail`


const getLeagueSlug = (gid) => {
    if (gid.startsWith('13')) {
        return 'sacramento'
    } else if (gid.startsWith('14')) {
        return 'orlando'
    } else if (gid.startsWith('15')) {
        return 'vegas'
    } else if (gid.startsWith('16')) {
        return 'utah'
    } else {
        return 'nba'
    }
}

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
        const date = moment(dateStr)
        // if it's after july, it's a new season
        const year = date.month() > 5 ? date.year() : date.add(-1, 'years').year()
        const leagueSlug = getLeagueSlug(gid)
        const advanced = await fetch(`${oldBase(year, leagueSlug)}/${gid}_gamedetail.json`)
        const { g } = await advanced.json()
        return g
    } catch (error) {
        return {}
    }
}

const fetchGameHighlight = async (gid) => {
    try {
        const res = await fetch(`https://boxscores.site/v/${gid}`)
        const {url} = await res.json()
        return url
    } catch (error) {
        return null
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

export const fetchGameHighlightIfNeeded = (gid) => async (dispatch, getState) => {
    const {
        bs: {
            bsData,
            urls,
        },
    } = getState()

    if (bsData && bsData.periodTime && bsData.periodTime.gameStatus === '3') {
        let url = null
        if (urls[gid] == null) {
            url = await fetchGameHighlight(gid)
        } else {
            url = urls[gid]
        }

        dispatch({
            type: types.UPDATE_VID,
            payload: {
                gid,
                url,
            },
        })
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
        live: { isLoading: isLiveLoading},
    } = getState()

    // if live is loading, wait to see if game exists
    if (isLiveLoading) {
        await waitUntilFinish(() => {
            return getState().live.isLoading
        }, false)
    }

    const {
        bs: {
            bsData,
            gid: oldGid,
        },
        date: { date },
        live: { lastUpdate, games: liveGames },
    } = getState()

    const selectedGame = liveGames.find((game) => game.id === gid)
    if (!selectedGame) {
        dispatch(push('/boxscores'))
        return
    }

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
