import types from './types'

export const toggleModal = ({ modalType, ...customProps }) => (dispatch) => {
  dispatch({
    type: types.TOGGLE_MODAL,
    payload: {
      modalType,
      custom: {
        ...customProps,
      },
    },
  })
}
