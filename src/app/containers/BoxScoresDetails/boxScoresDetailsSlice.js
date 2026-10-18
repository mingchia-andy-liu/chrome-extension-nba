import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import isAfter from 'date-fns/isAfter'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { convertBSProxy } from '../../utils/convert'
import getAPIDate from '../../utils/getApiDate'
import { DATE_FORMAT } from '../../utils/constant'
import { waitUntilFinish } from '../../utils/common'
import { proxyUrl } from '../../utils/proxy'

const initialState = {
  bsData: {},
  gid: '',
  isLoading: false,
  pbpData: {},
  teamStats: {},
}

const sanitizeBS = ({ home, visitor, officials, periodTime, arena }) => ({
  home,
  visitor,
  periodTime,
  officials: officials || [],
  arena: arena,
})

const teamStatsConverterProxy = (data) => ({
  benchPoints: data.benchPoints,
  biggestLead: data.biggestLead,
  fastBreakPoints: data.pointsFastBreak,
  fastBreakPointsAttempted: data.fastBreakPointsAttempted,
  fastBreakPointsMade: data.fastBreakPointsMade,
  pointsInPaint: data.pointsInThePaint,
  pointsInPaintAttempted: data.pointsInThePaintAttempted,
  pointsInPaintMade: data.pointsInThePaintMade,
  pointsOffTurnovers: data.pointsFromTurnovers,
  secondChancePoints: data.pointsSecondChance,
})

const pbpDecorater = (pbp) => {
  let prev = null
  return {
    ...pbp,
    play: (pbp.play || []).map((play) => {
      const curr = +play.scoreHome - +play.scoreAway
      let next
      if (curr !== 0) {
        next = (curr > 0 && prev < 0) || (curr < 0 && prev > 0) ? true : null
        prev = curr
      }
      return {
        ...play,
        changes: next,
      }
    }),
  }
}

export const fetchLiveGameBox = createAsyncThunk(
  'boxScoresDetails/fetchLiveGameBox',
  async ({ dateStr, gid }) => {
    // The two NBA endpoints are independent, so fetch them concurrently.
    const [pbpData, boxScoreData] = await Promise.all([
      fetchPBP(dateStr, gid),
      fetchGameDetail(dateStr, gid),
    ])

    const game = boxScoreData.game
    if (
      !game ||
      !Array.isArray(game.officials) ||
      !Array.isArray(game.homeTeam?.periods) ||
      !Array.isArray(game.homeTeam?.players) ||
      !game.homeTeam.statistics ||
      !Array.isArray(game.awayTeam?.periods) ||
      !Array.isArray(game.awayTeam?.players) ||
      !game.awayTeam.statistics
    ) {
      throw Error('box score data is invalid')
    }

    return {
      boxScoreData: boxScoreData.game || {},
      gid,
      pbpData: pbpData.game || {},
      isProxy: pbpData.isProxy && boxScoreData.isProxy,
    }
  }
)

const boxScoresDetailsSlice = createSlice({
  name: 'boxScoresDetails',
  initialState,
  reducers: {
    resetLiveGameBox: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveGameBox.pending, (state, action) => {
        // Background refreshes retain the current view instead of showing a spinner.
        if (!action.meta.arg.isBackground) {
          state.isLoading = true
        }
      })
      .addCase(fetchLiveGameBox.fulfilled, (state, action) => {
        const { boxScoreData, gid, pbpData } = action.payload
        state.bsData = sanitizeBS(convertBSProxy(boxScoreData))
        state.gid = gid
        state.isLoading = false
        state.pbpData = pbpDecorater(pbpData)
        state.teamStats = {
          home: teamStatsConverterProxy(boxScoreData.homeTeam.statistics),
          visitor: teamStatsConverterProxy(boxScoreData.awayTeam.statistics),
          extra: {
            leadChanges: boxScoreData.homeTeam.statistics.leadChanges,
            timesTied: boxScoreData.homeTeam.statistics.timesTied,
          },
        }
      })
      .addCase(fetchLiveGameBox.rejected, () => initialState)
  },
})

export const { resetLiveGameBox } = boxScoresDetailsSlice.actions

export const selectBoxScoresDetails = (state) => state.bs

// const dataURL = 'https://data.nba.com/data/10s'
// const oldBase = (year, leagueSlug) =>
//   `${dataURL}/v2015/json/mobile_teams/${leagueSlug}/${year}/scores/gamedetail`

// const getLeagueSlug = (gid) => {
//   if (gid.startsWith('13')) {
//     return 'sacramento'
//   } else if (gid.startsWith('14')) {
//     return 'orlando'
//   } else if (gid.startsWith('15')) {
//     return 'vegas'
//   } else if (gid.startsWith('16')) {
//     return 'utah'
//   } else {
//     return 'nba'
//   }
// }

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
    const pbp = await fetch(
      proxyUrl(
        `cdn.nba.com/static/json/liveData/playbyplay/playbyplay_${gid}.json`
      )
    )
    const json = await pbp.json()
    return {
      isProxy: false,
      game: {
        gameId: gid,
        play: json?.game?.actions,
      },
    }
  } catch (error) {
    return {}
  }
}

const fetchGameDetail = async (_, gid) => {
  try {
    const bs = await fetch(
      proxyUrl(`cdn.nba.com/static/json/liveData/boxscore/boxscore_${gid}.json`)
    )
    const json = await bs.json()
    return {
      isProxy: false,
      game: json.game,
    }
  } catch (error) {
    return {}
  }
}

export const fetchLiveGameBoxIfNeeded =
  (dateStr, gid, isBackground = null, navigate) =>
  async (dispatch, getState) => {
    if (gid == null || gid === '') {
      return
    }

    const apiDate = getAPIDate()
    // Future games do not have a box score yet.
    if (isAfter(parse(dateStr, DATE_FORMAT, new Date()), apiDate)) {
      return
    }

    // The live schedule must load before validating the requested game ID.
    if (getState().live.isLoading) {
      await waitUntilFinish(() => getState().live.isLoading, false)
    }

    const {
      bs: { bsData, gid: oldGid },
      date: { date },
      live: { lastUpdate, games: liveGames },
    } = getState()

    const selectedGame = liveGames.find((game) => game.id === gid)
    if (!selectedGame) {
      if (navigate) {
        navigate('/boxscores')
      } else {
        window.location.hash = '/boxscores'
      }
      return
    }

    const oldDateStr = format(date, DATE_FORMAT)
    const updateDiff = differenceInSeconds(Date.now(), lastUpdate)
    // Reuse final scores and recently refreshed live scores.
    if (
      oldDateStr === dateStr &&
      oldGid === gid &&
      ((bsData.periodTime && bsData.periodTime.gameStatus === '3') ||
        updateDiff < 55)
    ) {
      return
    }

    isBackground = isBackground === false ? false : oldGid === gid
    return dispatch(fetchLiveGameBox({ dateStr, gid, isBackground }))
  }

export default boxScoresDetailsSlice.reducer
