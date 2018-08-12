import types from './types'


const initState = {
    isLoading: false,
    east: [],
    west: [],
}

const conferenceExtractor = (teams, conf) => (
    teams.filter(team => team[5] === conf).map(team => ({
        name: team[4],
        playoffCode: team[8],
        win: team[12],
        loss: team[13],
        percentage: team[14],
        gamesBehind: team[37],
        homeRecord: team[17],
        awayRecord: team[18],
        lastTenRecord: team[19],
        streak: team[35],
        pf: team[56],
        pa: team[57],
        diff: team[58],
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
                east: conferenceExtractor(action.payload, 'East'),
                west: conferenceExtractor(action.payload, 'West'),
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
