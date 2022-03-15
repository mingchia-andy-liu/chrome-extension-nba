import { push } from 'react-router-redux'
import isAfter from 'date-fns/isAfter'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import types from './types'
import getAPIDate, { getLeagueYear } from '../../utils/getApiDate'
import { DATE_FORMAT } from '../../utils/constant'
import { waitUntilFinish } from '../../utils/common'

const dataURL = 'https://data.nba.com/data/10s'
const base = `${dataURL}/json/cms/noseason/game`
const oldBase = (year, leagueSlug) =>
  `${dataURL}/v2015/json/mobile_teams/${leagueSlug}/${year}/scores/gamedetail`

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

const isEmpty = (data) => Object.keys(data).length === 0

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
    const {
      sports_content: { game: pbpData },
    } = await pbp.json()
    return pbpData
  } catch (error) {
    return {}
  }
}

const fetchGameDetail = async (dateStr, gid) => {
  try {
    const date = parse(dateStr, DATE_FORMAT, new Date())
    const year = getLeagueYear(date)
    const leagueSlug = getLeagueSlug(gid)
    const advanced = await fetch(
      `${oldBase(year, leagueSlug)}/${gid}_gamedetail.json`
    )
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
    const [pbpData, boxScoreData] = await Promise.all([
      fetchPBP(dateStr, gid),
      fetchGameDetail(dateStr, gid),
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

export const fetchLiveGameBoxIfNeeded =
  (dateStr, gid, isBackground = null) =>
  async (dispatch, getState) => {
    if (gid == null || gid === '') {
      return
    }

    const apiDate = getAPIDate()
    // if the date is in the future, then exit early
    if (isAfter(parse(dateStr, DATE_FORMAT, new Date()), apiDate)) {
      return
    }

    const {
      live: { isLoading: isLiveLoading },
    } = getState()

    // if live is loading, wait to see if game exists
    if (isLiveLoading) {
      await waitUntilFinish(() => {
        return getState().live.isLoading
      }, false)
    }

    const {
      bs: { bsData, gid: oldGid },
      date: { date },
      live: { lastUpdate, games: liveGames },
    } = getState()

    const selectedGame = liveGames.find((game) => game.id === gid)
    if (!selectedGame) {
      dispatch(push('/boxscores'))
      return
    }

    const oldDateStr = format(date, DATE_FORMAT)
    const updateDiff = differenceInSeconds(Date.now(), lastUpdate)

    // if it's different day and different id, fetch new
    if (oldDateStr === dateStr && oldGid === gid) {
      // if it's same game but the game is finished, use old
      // if it's less than 60 seconds from the last update, use old
      if (
        (bsData.periodTime && bsData.periodTime.gameStatus === '3') ||
        updateDiff < 55
      ) {
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
