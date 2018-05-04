import types from './types'

const initState = {
    isLoading: false,
    /**
     * has box scores and playbyplay
     */
    gameDetails: {},
}

const formatPeroid = (key, score) => ({
    period: key,
    score,
})

const sanitizeHelper = ({ q1, q2, q3, q4, ot1, ot2, ot3, ot4, ot5, ot6, ot7, ot8, ot9, ot10 }) => ([
    formatPeroid('Q1', q1),
    formatPeroid('Q2', q2),
    formatPeroid('Q3', q3),
    formatPeroid('Q4', q4),
    formatPeroid('OT1', ot1),
    formatPeroid('OT2', ot2),
    formatPeroid('OT3', ot3),
    formatPeroid('OT4', ot4),
    formatPeroid('OT5', ot5),
    formatPeroid('OT6', ot6),
    formatPeroid('OT7', ot7),
    formatPeroid('OT8', ot8),
    formatPeroid('OT9', ot9),
    formatPeroid('OT10', ot10)
])

const sanitizeBS = ({ gid, gdte, ac, an, stt, cl, vls, hls, offs : off }) => ({
    gid,
    gdte,
    ac,
    an,
    stt,
    cl,
    // home
    hta: hls.ta,
    htn: hls.tn,
    hs: sanitizeHelper(hls),
    hss: hls.s,
    htstsg: hls.tstsg,
    hpstsg: hls.pstsg,
    // visitor
    vta: vls.ta,
    vtn: vls.tn,
    vss: vls.s,
    vs: sanitizeHelper(vls),
    vtstsg: vls.tstsg,
    vpstsg: vls.pstsg,
    // officials
    offs: off
})

export default (state = initState, action) => {
    switch (action.type) {
        case types.REQUEST_START:
        case types.PBP_REQUEST_START:
            return {
                ...state,
                isLoading: true,
            }
        case types.REQUEST_SUCCESS:
            return {
                isLoading: false,
                gameDetails: {
                    ...state.gameDetails,
                    [action.payload.gid]: {
                        ...state.gameDetails[action.payload.gid],
                        bs: sanitizeBS(action.payload)
                    }
                }
            }
        case types.PBP_REQUEST_SUCCESS:
            return {
                isLoading: false,
                gameDetails: {
                    ...state.gameDetails,
                    [action.payload.gid]: {
                        ...state.gameDetails[action.payload.gid],
                        pd: action.payload.pd
                    }
                }
            }
        case types.REQUEST_ERROR:
        case types.PBP_REQUEST_ERROR:
            return {
                ...state,
                isLoading: false,
            }
        default:
            return state
    }
}
