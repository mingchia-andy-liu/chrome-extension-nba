import { apiSlice } from '../../api/apiSlice'
import { getLeagueYear } from '../../utils/getApiDate'

export const transformPlayoffs = ({ bracket: { playoffBracketSeries } }) =>
  playoffBracketSeries.map((serie) => ({
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
  }))

const playoffsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlayoffs: builder.query({
      query: () => {
        const year = getLeagueYear(new Date())
        return `https://stats.nba.com/stats/playoffbracket?SeasonYear=${year}&LeagueID=00&State=2`
      },
      transformResponse: transformPlayoffs,
    }),
  }),
})

export const { useGetPlayoffsQuery } = playoffsApi
