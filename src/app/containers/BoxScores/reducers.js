import types from './types'
import convert from './convert'

const initState = {
    isLoading: false,
    /**
     * has box scores and playbyplay
     */
    bsData: {},
    pbpData: {},
    teamStats: {},
}

const sanitizeBS = ({ home, visitor, officials }) => ({
    home,
    visitor,
    officials: officials || [],
})

const teamStatsConverter = (data) => {
    return {
        benchPoints: data.bpts,
        biggestLead: data.ble,
        fastBreakPoints: data.fbpts,
        fastBreakPointsAttempted: data.fbptsa,
        fastBreakPointsMade: data.fbptsm,
        pointsInPaint: data.pip,
        pointsInPaintAttempted: data.pipa,
        pointsInPaintMade: data.pipm,
        pointsOffTurnovers: data.potov,
        secondChancePoints: data.scp,
    }
}

const teamStatsExtrator = (data) => {
    if (Object.keys(data).length === 0) {
        return {
            hls: {},
            lc: 0,
            tt: 0,
            vls: {},
        }
    }
    return {
        hls: data.hls.tstsg,
        lc: data.gsts.lc,
        tt: data.gsts.tt,
        vls: data.vls.tstsg,
    }
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.REQUEST_START:
            return {
                ...state,
                isLoading: true,
            }
        case types.REQUEST_SUCCESS: {
            const { boxScoreData, pbpData } = action.payload
            const team = teamStatsExtrator(boxScoreData)
            return {
                isLoading: false,
                bsData: sanitizeBS(convert(boxScoreData)),
                pbpData: pbpData,
                teamStats: {
                    home: teamStatsConverter(team.hls),
                    visitor: teamStatsConverter(team.vls),
                    extra: {
                        leadChanges: team.lc,
                        timesTied: team.tt,
                    },
                },
            }
        }
        case types.REQUEST_ERROR:
        case types.RESET:
            return {
                isLoading: false,
                bsData: {},
                pbpData: {},
                teamStats: {},
            }
        default:
            return state
    }
}
