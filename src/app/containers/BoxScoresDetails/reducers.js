import types from './types'
import convert from './convert'

/**
 * has box scores and playbyplay
 */
const initState = {
    bsData: {},
    gid: '',
    isLoading: false,
    pbpData: {},
    teamStats: {},
}

const sanitizeBS = ({ home, visitor, officials, periodTime }) => ({
    home,
    visitor,
    periodTime,
    officials: officials || [],
})

const teamStatsConverter = (data) => {
    if (!data) {
        return {}
    }
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
        lc: data.gsts ? data.gsts.lc : 0,
        tt: data.gsts ? data.gsts.tt : 0,
        vls: data.vls.tstsg,
    }
}

const pbpDecorater = (pbp) => {
    let prev = null
    return {
        ...pbp,
        play: (pbp.play || []).map(play => {
            const curr = +play.home_score - +play.visitor_score
            let next
            if (curr !== 0) {
                next = (curr > 0 && prev < 0) || (curr < 0 && prev > 0)
                    ? true
                    : null
                prev = curr
            }
            return {
                ...play,
                changes: next,
            }
        }),
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
            const { boxScoreData, gid, pbpData } = action.payload
            const team = teamStatsExtrator(boxScoreData)
            return {
                bsData: sanitizeBS(convert(boxScoreData)),
                gid,
                isLoading: false,
                pbpData: pbpDecorater(pbpData),
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
                bsData: {},
                gid: '',
                isLoading: false,
                pbpData: {},
                teamStats: {},
            }
        default:
            return state
    }
}
