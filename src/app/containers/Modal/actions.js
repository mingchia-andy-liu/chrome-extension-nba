import types from './types'

export const toggleModal = () => (dispatch) => {
    dispatch({ type: types.TOGGLE_MODAL })
}
