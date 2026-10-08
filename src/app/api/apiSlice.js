import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getLeagueYear } from '../utils/getApiDate'
import { eastTeams, westTeams } from '../utils/teams'

const conferenceExtractor = (teams, isEast) =>
  teams
    .filter((team) =>
      (isEast ? eastTeams : westTeams).includes(team[2].toString())
    )
    .map((team) => ({
      name: team[4],
      id: team[2],
      playoffCode: team[9],
      win: team[13],
      loss: team[14],
      percentage: team[15],
      gamesBehind: team[38],
      homeRecord: team[18],
      awayRecord: team[19],
      lastTenRecord: team[20],
      streak: team[36],
    }))

export const transformStandings = ({ resultSets }) => {
  const teams = resultSets[0]?.rowSet ?? []
  return {
    east: conferenceExtractor(teams, true),
    west: conferenceExtractor(teams, false),
  }
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://proxy.boxscores.site',
    fetchFn: (...args) => fetch(...args),
  }),
  endpoints: (builder) => ({
    getStandings: builder.query({
      query: () => {
        const year = getLeagueYear(new Date())
        const nextYear = (year + 1) % 100
        const season = `${year}-${nextYear}`
        return `?apiUrl=stats.nba.com/stats/leaguestandingsv3&GroupBy=conf&LeagueID=00&Season=${season}&SeasonType=Regular%20Season&Section=overall`
      },
      transformResponse: transformStandings,
    }),
  }),
})

export const { useGetStandingsQuery } = apiSlice
