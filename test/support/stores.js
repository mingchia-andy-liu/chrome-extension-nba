import { configureStore } from '@reduxjs/toolkit'
import appReducer, {
  initialState as appInitialState,
} from '../../src/app/reducers'
import popupReducer, {
  initialState as popupInitialState,
} from '../../src/app/popup/reducers'
import { apiSlice } from '../../src/app/api/apiSlice'

export const createAppStore = (preloadedState = appInitialState) =>
  configureStore({
    reducer: appReducer,
    preloadedState,
    // Match the runtime stores' legacy Date-containing state.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        apiSlice.middleware
      ),
  })

export const createPopupStore = (preloadedState = popupInitialState) =>
  configureStore({
    reducer: popupReducer,
    preloadedState,
    // Match the runtime stores' legacy Date-containing state.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        apiSlice.middleware
      ),
  })
