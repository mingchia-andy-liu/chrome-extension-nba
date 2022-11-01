import types from './types'
import { eastTeams, westTeams } from '../../utils/teams'

const initState = {
  isLoading: false,
  east: [],
  west: [],
}

// for stats.nab.com
const conferenceExtractor = (teams, isEast) =>
  teams
    .filter((team) =>
      isEast ? eastTeams.includes(team.teamId) : westTeams.includes(team.teamId)
    )
    .map((team) => ({
      name: team.teamSitesOnly.teamNickname,
      playoffCode: team.clinchedPlayoffsCode,
      win: team.win,
      loss: team.loss,
      percentage: team.winPct,
      gamesBehind: team.gamesBehind,
      homeRecord: `${team.homeWin}-${team.homeLoss}`,
      awayRecord: `${team.awayWin}-${team.awayLoss}`,
      lastTenRecord: `${team.lastTenWin}-${team.lastTenLoss}`,
      streak: `${team.isWinStreak ? team.streak : -1 * team.streak}`,
    }))

const conferenceExtractorV3 = (teams, isEast) => 
    teams
    .filter((team) =>
      isEast ? eastTeams.includes(team[2].toString()) : westTeams.includes(team[2].toString())
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

export default (state = initState, action) => {
  switch (action.type) {
    case types.REQUEST_START:
      return {
        ...state,
        isLoading: true,
      }
    case types.REQUEST_SUCCESS: {
      return {
        isLoading: false,
        east: conferenceExtractorV3(action.payload, true),
        west: conferenceExtractorV3(action.payload, false),
      }
    }
    case types.REQUEST_ERROR:
      return {
        isLoading: false,
        east: [],
        west: [],
      }
    default:
      return state
  }
}
