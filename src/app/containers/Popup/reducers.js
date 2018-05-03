import types from './types'

const initState = {
    dateET: new Date(0),
    dateTZ: new Date(0),
    isLoading: false,
    games: [],
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.REQUEST_START:
            return {
                ...state,
                isLoading: true,
            }
        case types.REQUEST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                games: action.payload.g,
                dateET: new Date(action.payload.gdte)
            }
        case types.REQUEST_ERROR:
            return {
                ...state,
                isLoading: false,
                games: []
            }
        default:
            return state
    }
}
