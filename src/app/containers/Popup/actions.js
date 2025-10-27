import format from 'date-fns/format'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import parse from 'date-fns/parse'
import types from './types'
import getApiDate, { isOffseason } from '../../utils/getApiDate'
import { DATE_FORMAT } from '../../utils/constant'
import { checkLiveGame } from '../../utils/browser'
import { allSettled } from '../../utils/common'

/**
 * Migrate from background.js `fetchGames`
 */

/**
 * Fetch games to provided date
 * @param {string} dateStr selected date in string format
 * @param {function} callback callback to see if the 'id' in the URL is valid
 */
const fetchGames = async (dispatch, dateStr, callback, isBackground) => {
  try {
    // has the UI been shown yet, if so, don't show the loading spinner
    if (!isBackground) {
      dispatch({ type: types.REQUEST_START })
    }

    const games = await fetchRequest(dateStr)
    dispatch({
      type: types.REQUEST_SUCCESS,
      payload: games,
    })
    const newGames = games.isFallBack ? games.games : games
    if (format(getApiDate(), DATE_FORMAT) === dateStr) {
      checkLiveGame(newGames, games.isFallBack)
    }
    if (callback) callback(newGames)
  } catch (error) {
    // debug log here.
    // if any of the fetch requests fail, set the state to error
    if (callback) callback([])
    dispatch({ type: types.REQUEST_ERROR })
  }
}

const fetchRequest3 = async (dateStr) => {
  // only use cdn for apiDate as it's the only endpoint
  if (format(getApiDate(), DATE_FORMAT) !== dateStr) {
    return fetchRequest4(dateStr)
  }

  let apiGameDate = null

  let g = []
  try {
    const res = await fetch(
      'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json'
    )
    const {
      scoreboard: { games, gameDate },
    } = await res.json()

    apiGameDate = gameDate.replaceAll('-', '')

    g = games
  } catch (e) {
    try {
      const res = await fetch(
        'https://proxy.boxscores.site?apiUrl=cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json'
      )
      const {
        scoreboard: { games, gameDate },
      } = await res.json()

      apiGameDate = gameDate.replaceAll('-', '')

      g = games
    } catch (error) {}
  }

  // if the return response is not the same as API date, then response must be the previous date
  // but we should actually be fetching the new date, use 4 for per date.
  if (apiGameDate !== null && apiGameDate !== dateStr) {
    return fetchRequest4(dateStr)
  }

  return {
    isFallBack: 3,
    games: g,
  }
}

// new endpoint requires special headers.
const fetchRequest4 = async (dateStr) => {
  // const newDateStr = insertAt(insertAt(dateStr, 4, '-'), 7, '-')
  // try {
  //   const res2 = await fetch(
  //     `https://proxy.boxscores.site?apiUrl=stats.nba.com/stats/scoreboardv3&GameDate=${newDateStr}&LeagueID=00`
  //   )
  //   const {
  //     scoreboard: { games },
  //   } = await res2.json()
  //   g = games
  // } catch (error) {
  return fetchRequest5(dateStr)
  // }
  // return {
  //   isFallBack: 3,
  //   games: g,
  // }
}

const fetchRequest5 = async (dateStr) => {
  const slashDateStr = format(
    parse(dateStr, DATE_FORMAT, new Date()),
    'MM/dd/yyyy'
  )
  const res = await fetch(
    `https://proxy.boxscores.site/?apiUrl=core-api.nba.com/cp/api/v1.9/feeds/gamecardfeed&gamedate=${slashDateStr}`
  )
  const { cards } = await res.json()
  return {
    isFallBack: 5,
    games: cards,
  }
}

const fetchRequest = async (dateStr) => {
  return fetchRequest3(dateStr)
}

export const fetchGamesIfNeeded =
  (dateStr, callback, forceUpdate = false, isBackground = null) =>
  async (dispatch, getState) => {
    if (isOffseason(parse(dateStr, DATE_FORMAT, new Date()))) {
      dispatch({
        type: types.REQUEST_SUCCESS,
        payload: { games: [] },
      })
      return
    }

    const {
      live: { games, lastUpdate },
      date: { date },
    } = getState()
    const oldDateStr = format(date, DATE_FORMAT)
    const updateDiff = differenceInSeconds(Date.now(), lastUpdate)

    // if it's different day, or force update, fetch new
    if (oldDateStr === dateStr && !forceUpdate) {
      const hasPendingOrLiveGame = games.find(
        (game) => game.periodTime && game.periodTime.gameStatus !== '3'
      )

      if (!hasPendingOrLiveGame || updateDiff < 55) {
        return
      }
    }

    isBackground = isBackground === false ? false : oldDateStr === dateStr
    return await fetchGames(dispatch, dateStr, callback, isBackground)
  }

// ------ highlights -------

const fetchGameHighlight = async (gid) => {
  // const res = await fetch(`https://api.boxscores.site/v/${gid}`)
  // const { url } = await res.json()
  // return { [gid]: url }
  return {}
}

export const fetchGameHighlightIfNeeded = () => async (dispatch, getState) => {
  const {
    live: { urls, games },
  } = getState()

  const fetchPromises = games.map((game) => {
    return new Promise((resolve, reject) => {
      if (urls[game.id] == null && game.periodTime.gameStatus === '3') {
        fetchGameHighlight(game.id).then(resolve).catch(reject)
      } else {
        resolve(null)
      }
    })
  })

  const urlsResults = await allSettled(fetchPromises)
  const merged = urlsResults.reduce((accu, curr) => {
    if (curr == null || curr.status === 'rejected') {
      return accu
    }
    return {
      ...accu,
      ...curr.value,
    }
  }, {})
  dispatch({
    type: types.UPDATE_VID,
    payload: merged,
  })
}
