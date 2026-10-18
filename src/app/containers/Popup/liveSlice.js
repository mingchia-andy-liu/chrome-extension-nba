import { createSlice } from '@reduxjs/toolkit'
import { sanitizeGames } from '../../utils/games'

export const initialState = {
  hasError: false,
  isLoading: true,
  games: [],
  lastUpdate: new Date(0),
  urls: {},
}

const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    gamesRequestStarted: (state) => {
      state.hasError = false
      state.isLoading = true
    },
    gamesRequestSucceeded: (state, action) => {
      try {
        state.games = sanitizeGames(
          action.payload.games,
          action.payload.isFallBack
        )
        state.hasError = false
        state.isLoading = false
        state.lastUpdate = new Date()
      } catch (error) {
        state.games = []
        state.hasError = true
        state.isLoading = false
        state.lastUpdate = new Date(0)
      }
    },
    gamesRequestFailed: (state) => {
      state.games = []
      state.hasError = true
      state.isLoading = false
      state.lastUpdate = new Date(0)
    },
    highlightsUpdated: (state, action) => {
      Object.assign(state.urls, action.payload)
    },
  },
})

export const {
  gamesRequestStarted,
  gamesRequestSucceeded,
  gamesRequestFailed,
  highlightsUpdated,
} = liveSlice.actions

export default liveSlice.reducer
