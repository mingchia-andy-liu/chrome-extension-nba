import { createSlice } from '@reduxjs/toolkit'
import { eastTeams, westTeams } from '../../utils/teams'

const conferenceExtractorV3 = (teams, isEast) =>
  teams
    .filter((team) =>
      isEast
        ? eastTeams.includes(team[2].toString())
        : westTeams.includes(team[2].toString())
    )
    .map((team) => ({
      name: team[4],
      playoffCode: team[8],
      win: team[13],
      loss: team[14],
      percentage: team[15],
      gamesBehind: team[38],
      homeRecord: team[18],
      awayRecord: team[19],
      lastTenRecord: team[20],
      streak: team[36],
    }))

const conferenceExtractorV3Proxy = (teams, isEast) =>
  teams
    .filter((team) =>
      isEast
        ? eastTeams.includes(team.TeamID.toString())
        : westTeams.includes(team.TeamID.toString())
    )
    .map((team) => ({
      name: team.TeamName,
      playoffCode: team.PlayoffRank,
      win: team.WINS,
      loss: team.LOSSES,
      percentage: team.WinPCT,
      gamesBehind: team.ConferenceGamesBack,
      homeRecord: team.HOME,
      awayRecord: team.ROAD,
      lastTenRecord: team.L10,
      streak: team.CurrentStreak,
    }))

const extractor = (teams, isEast, isProxy) => {
  return isProxy
    ? conferenceExtractorV3Proxy(teams, isEast)
    : conferenceExtractorV3(teams, isEast)
}

const standingsSlice = createSlice({
  name: 'standings',
  initialState: {
    isLoading: false,
    east: [],
    west: [],
  },
  reducers: {
    fetchStandingsPending(state, action) {
      state.isLoading = true
    },
    fetchStandingsFulfilled(state, action) {
      state.isLoading = false
      state.east = extractor(action.payload.data, true, action.payload.isProxy)
      state.west = extractor(action.payload.data, false, action.payload.isProxy)
    },
    fetchStandingsRejected(state, action) {
      state.isLoading = false
      state.east = []
      state.west = []
    }
  }
});

const { fetchStandingsPending, fetchStandingsFulfilled, fetchStandingsRejected } = standingsSlice.actions

export const fetchStandings = () => async (dispatch) => {
  try {
    dispatch(fetchStandingsPending())

    let data = []
    let isProxy = true
    try {
      const res = await fetch(
        'https://api.boxscores.site/v1/standings?LeagueID=00&Season=2022-23'
      )
      const teams = await res.json()
      data = teams
    } catch (error) {
      const res = await fetch(
        'https://proxy.boxscores.site?apiUrl=stats.nba.com/stats/leaguestandingsv3&GroupBy=conf&LeagueID=00&Season=2022-23&SeasonType=Regular%20Season&Section=overall'
      )
      const { resultSets } = await res.json()
      const teams = resultSets[0]?.rowSet ?? []
      data = teams
      isProxy = false
    }

    dispatch(fetchStandingsFulfilled({ data, isProxy }))
  } catch (error) {
    dispatch(fetchStandingsRejected())
  }
}

export default standingsSlice.reducer