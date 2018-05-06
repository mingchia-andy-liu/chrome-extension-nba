import types from './types'

const initState = {
    isLoading: false,
    /**
     * has box scores and playbyplay
     */
    bsData: {},
    pbpData: {},
}

const sanitizeBS = ({ arena, home, visitor, officials }) => ({
    arena,
    home,
    visitor,
    officials,
})

export default (state = initState, action) => {
    switch (action.type) {
        case types.REQUEST_START:
            return {
                ...state,
                isLoading: true,
            }
        case types.REQUEST_SUCCESS:
            return {
                isLoading: false,
                bsData: sanitizeBS(action.payload.boxScoreData),
                pbpData: action.payload.pbpData,
            }
        case types.REQUEST_ERROR:
            return {
                isLoading: false,
                bsData: {},
                pbpData: {},
            }
        default:
            return state
    }
}
