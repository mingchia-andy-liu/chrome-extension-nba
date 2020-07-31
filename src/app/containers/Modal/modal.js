import modalTypes from './modal-types'
import Video from '../../components/Video'

const constants = {
  [modalTypes.HIGHLIGH_VIDEO]: {
    template: Video,
  },
  [modalTypes.DEFAULT]: {
    template: null,
  },
}

export default Object.freeze(constants)
