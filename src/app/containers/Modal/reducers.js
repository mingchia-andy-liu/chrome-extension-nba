import types from './types'

const initState = {
    isOpen: false,
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.TOGGLE_MODAL:
            return {
                ...state,
                isOpen: !state.isOpen,
            }
        default:
            return state
    }
}
