import types from './types'

const initState = {
    isLoading: false,
    /**
     * has box scores and playbyplay
     */
    gameDetails: {},
}

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
                        bs: action.payload
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
