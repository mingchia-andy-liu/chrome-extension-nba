import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getLeagueYear } from '../../utils/getApiDate'

const normalizer = (serie) => ({
  roundNum: serie.roundNumber,
  confName: serie.seriesConference,
  seriesId: serie.seriesId,
  isScheduleAvailable: true,
  isSeriesCompleted: serie.seriesStatus !== 1,
  summaryStatusText: serie.seriesText,
  gameNumber: serie.nextGameNumber,
  isGameLive: serie.nextGameStatus === 2,
  topRow: {
    teamId: serie.highSeedId,
    seedNum: serie.highSeedRank,
    wins: serie.highSeedSeriesWins,
    isSeriesWinner: serie.highSeedSeriesWins === 4,
  },
  bottomRow: {
    teamId: serie.lowSeedId,
    seedNum: serie.lowSeedRank,
    wins: serie.lowSeedSeriesWins,
    isSeriesWinner: serie.lowSeedSeriesWins === 4,
  },
})

const playoffSlice = createSlice({
  name: 'playoffs',
  initialState: {
    isLoading: false,
    series: [],
  },
  reducers: {
    fetchPlayoffsPending(state, action) {
      state.isLoading = true
    },
    fetchPlayoffsFulfilled(state, action) {
      const { series } = action.payload
      state.isLoading = false;
      state.series = series.map(normalizer);
    },
    fetchPlayoffsRejected(state, action) {
      state.isLoading = false
      state.series = []
    }
  }
});

const { fetchPlayoffsPending, fetchPlayoffsFulfilled, fetchPlayoffsRejected } = playoffSlice.actions

export const fetchPlayoffs = () => async (dispatch) => {
  dispatch(fetchPlayoffsPending())
  try {
    const year = getLeagueYear(new Date())

    let bracket = []
    try {
      const res = await fetch(
        `https://api.boxscores.site/v1/playoff?Season=${year}`
      )
      const { playoffBracketSeries } = await res.json()
      bracket = playoffBracketSeries
    } catch (error) {
      const res = await fetch(
        `https://stats.nba.com/stats/playoffbracket?SeasonYear=${year}&LeagueID=00&State=2`
      )
      const {
        bracket: { playoffBracketSeries },
      } = await res.json()
      bracket = playoffBracketSeries
    }
  
    dispatch(fetchPlayoffsFulfilled({
      version: 1,
      series: bracket || [],
    }))
  } catch (error) {
    dispatch(fetchPlayoffsRejected())
  }
}

export default playoffSlice.reducer