import types from './types'

const initState = {
  isLoading: false,
  series: [],
}

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

export default (state = initState, action) => {
  switch (action.type) {
    case types.REQUEST_START:
      return {
        ...state,
        isLoading: true,
      }
    case types.REQUEST_SUCCESS: {
      const { series } = action.payload
      return {
        isLoading: false,
        series: series.map(normalizer),
      }
    }
    case types.REQUEST_ERROR:
      return {
        isLoading: false,
        series: [],
      }
    default:
      return state
  }
}
