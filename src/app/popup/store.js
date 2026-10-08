import { configureStore } from '@reduxjs/toolkit'
import reducer, { initialState } from './reducers'
import { apiSlice } from '../api/apiSlice'

export const store = configureStore({
  reducer,
  preloadedState: initialState,
  // Existing score and date state contains Date instances.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware
    ),
})
