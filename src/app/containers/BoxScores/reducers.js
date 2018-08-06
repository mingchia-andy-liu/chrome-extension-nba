import types from './types'

const initState = {
    isLoading: false,
    /**
     * has box scores and playbyplay
     */
    bsData: {},
    pbpData: {},
    g: {},
}

const sanitizeBS = ({ arena, home, visitor, officials }) => ({
    arena,
    home,
    visitor,
    officials,
})

const teamStatsConverter = (data) => {
    return {
        biggest_lead: data.ble,
        bench_points: data.bpts,
        fast_break_points: data.fbpts,
        fast_break_points_attempted: data.fbptsa,
        fast_break_points_made: data.fbptsm,
        points_in_paint: data.pip,
        points_in_paint_attempted: data.pipa,
        points_in_paint_made: data.pipm,
        points_off_turnovers: data.potov,
        second_chance_points: data.scp,
    }
}

const teamStatsExtrator = (data) => {
    if (Object.keys(data).length === 0) {
        return {
            hls: {},
            vls: {},
            lc: 0,
            tt: 0,
        }
    }
    return {
        hls: data.hls.tstsg,
        vls: data.vls.tstsg,
        lc: data.gsts.lc,
        tt: data.gsts.tt,
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
            const team = teamStatsExtrator(action.payload.g)
            return {
                isLoading: false,
                bsData: sanitizeBS(action.payload.boxScoreData),
                pbpData: action.payload.pbpData,
                team: {
                    home: teamStatsConverter(team.hls),
                    visitor: teamStatsConverter(team.vls),
                    extra: {
                        lead_changes: team.lc,
                        times_tied: team.tt,
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
                team: {},
            }
        default:
            return state
    }
}
