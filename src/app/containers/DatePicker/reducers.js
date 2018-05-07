import types from './types'

const initState = {
    date: new Date(0),
    isDirty: false,
}

export default (state = initState, action) => {
    switch(action.type) {
        case types.CHANGE_SELECTED_GAME:
            return {
                date: action.payload.date,
                isDirty: true,
            }
        default:
            return state
    }
}
