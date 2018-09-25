import types from './types'
import getAPIDate from '../../utils/getApiDate'

const initState = {
    date: getAPIDate(),
}

export default (state = initState, action) => {
    switch(action.type) {
        case types.CHANGE_SELECTED_GAME:
            return { date: action.payload }
        default:
            return state
    }
}
