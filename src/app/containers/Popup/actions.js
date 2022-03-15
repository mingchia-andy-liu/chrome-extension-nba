import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import parse from 'date-fns/parse'
import types from './types'
import getApiDate, { getLeagueYear } from '../../utils/getApiDate'
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
    // if any of the fetch requests fail, set the state to error
    if (callback) callback([])
    dispatch({ type: types.REQUEST_ERROR })
  }
}

const fetchRequest3 = async (dateStr) => {
  // only use cdn for apiDate as it's the only endpoint
  try {
    const res = await fetch('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json')
    const { scoreboard: { games, gameDate } } = await res.json()

    if (gameDate.replaceAll('-', '') !== dateStr) {
      throw Error("wrong date use other endpoints");
    }

    const res2 = await fetch(`http://data.nba.net/prod/v2/${dateStr}/scoreboard.json`);
    const { games: games2 } = await res2.json();

    return {
      isFallBack: 3,
      games: games.map(g => ({
        ...g,
        watch: (games2.find(g2 => g2.gameId === g.gameId) || {}).watch
      }))
    }
  } catch (error) {
    return fetchRequest2(dateStr)
  }
}

const fetchRequest2 = async (dateStr) => {
  try {
    const res = await fetch(
      `http://data.nba.net/prod/v2/${dateStr}/scoreboard.json`
    )
    const { games } = await res.json()

    return {
      isFallBack: 2,
      games,
    }
  } catch (error) {
    return fetchRequest1(dateStr)
  }
}

const fetchRequest1 = async (dateStr) => {
  const date = parse(dateStr, DATE_FORMAT, new Date())
  if (!isSameDay(date, new Date())) {
    throw new Error()
  }
  const year = getLeagueYear(date)
  const res = await fetch(
    `https://data.nba.com/data/5s/v2015/json/mobile_teams/nba/${year}/scores/00_todays_scores.json`
  )
  const {
    gs: { g },
  } = await res.json()
  return {
    isFallBack: 1,
    games: g,
  }
}

const fetchRequest = async (dateStr) => {
  // try {
  //   const res = await fetch(
  //     `https://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dateStr}/games.json`
  //   )
  //   const {
  //     sports_content: {
  //       games: { game },
  //     },
  //   } = await res.json()
  //   return {
  //     games: game
  //   }
  // } catch (error) {
  //   return fetchRequestFailOver(dateStr)
  // }
  // TODO: the above endpoint seems to be broken for extended season
  // Review again once regular season starts
  return fetchRequest3(dateStr)
}

export const fetchGamesIfNeeded = (
  dateStr,
  callback,
  forceUpdate = false,
  isBackground = null
) => async (dispatch, getState) => {
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
  const res = await fetch(`https://api.boxscores.site/v/${gid}`)
  const { url } = await res.json()
  return { [gid]: url }
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
