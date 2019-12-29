import types from './types'
import { eastTeams, westTeams } from '../../utils/teams'


const initState = {
    isLoading: false,
    east: [],
    west: [],
}

// for stats.nab.com
const conferenceExtractor = (teams, isEast) => (
    teams
        .filter(team => (isEast ? eastTeams.includes(team['teamId']) : westTeams.includes(team['teamId'])))
        .map(team => ({
            name: team['teamSitesOnly']['teamNickname'],
            playoffCode: team['clinchedPlayoffsCode'],
            win: team['win'],
            loss: team['loss'],
            percentage: team['winPct'],
            gamesBehind: team['gamesBehind'],
            homeRecord: `${team['homeWin']}-${team['homeLoss']}`,
            awayRecord: `${team['awayWin']}-${team['awayLoss']}`,
            lastTenRecord: `${team['lastTenWin']}-${team['lastTenLoss']}`,
            streak: `${team['isWinStreak'] ? team['streak'] : -1 * team['streak']}`,
        }))
)

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
                east: conferenceExtractor(action.payload, true),
                west: conferenceExtractor(action.payload, false),
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
