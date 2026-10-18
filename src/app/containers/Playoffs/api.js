import { apiSlice } from '../../api/apiSlice'
import { playoffBracket } from './data'

export const transformPlayoffs = ({ bracket }) =>
  (bracket?.playoffBracketSeries ?? []).map((serie) => ({
    roundNum: serie.roundNumber,
    confName: serie.seriesConference,
    seriesId: serie.seriesId,
    isScheduleAvailable: false,
    isSeriesCompleted: serie.seriesStatus === 3,
    isGameLive: false,
    summaryStatusText: serie.seriesText,
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
  }))

const playoffsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlayoffs: builder.query({
      queryFn: () => ({ data: transformPlayoffs(playoffBracket) }),
    }),
  }),
})

export const { useGetPlayoffsQuery } = playoffsApi
