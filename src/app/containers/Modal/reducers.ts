import types from './types'
import modalType from './modal-types'

const initState = {
  isOpen: false,
  type: {
    modalType: modalType.DEFAULT,
    payload: {},
  },
}

export default (state = initState, action) => {
  switch (action.type) {
    case types.TOGGLE_MODAL: {
      return {
        isOpen: !state.isOpen,
        type: {
          modalType: action.payload.modalType,
          payload: {
            ...action.payload.custom,
          },
        },
      }
    }
    default:
      return state
  }
}
