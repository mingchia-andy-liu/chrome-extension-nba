import { createStore } from 'redux'
import appReducer, {
  initialState as appInitialState,
} from '../../src/app/reducers'
import popupReducer, {
  initialState as popupInitialState,
} from '../../src/app/popup/reducers'

export const createAppStore = (preloadedState = appInitialState) =>
  createStore(appReducer, preloadedState)

export const createPopupStore = (preloadedState = popupInitialState) =>
  createStore(popupReducer, preloadedState)
