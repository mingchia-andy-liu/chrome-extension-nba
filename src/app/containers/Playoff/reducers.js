import types from './types'


const initState = {
    isLoading: false,
    series: [],
}

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
                series: action.payload,
            }
        }
        case types.REQUEST_ERROR:
            return {
                isLoading: false,
                series: [],
            }
        default:
            return state
    }
}
