import types from './types'

export const dispatchChangeDate = (date) => async (dispatch) => {
    dispatch({
        type: types.CHANGE_SELECTED_GAME,
        payload: date,
    })
}
