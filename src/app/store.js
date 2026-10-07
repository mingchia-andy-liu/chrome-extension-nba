import { configureStore } from '@reduxjs/toolkit'
import reducer, { initialState } from './reducers'

export const store = configureStore({
  reducer,
  preloadedState: initialState,
  // Existing score and date state contains Date instances.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
