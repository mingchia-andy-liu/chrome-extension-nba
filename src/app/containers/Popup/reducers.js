import types from './types'
import { sanitizeGames } from '../../utils/games'

const initState = {
  hasError: false,
  isLoading: true,
  games: [],
  lastUpdate: new Date(0),
  urls: {},
}

export default (state = initState, action) => {
  switch (action.type) {
    case types.REQUEST_START:
      return {
        ...state,
        hasError: false,
        isLoading: true,
      }
    case types.REQUEST_SUCCESS: {
      try {
        const isFallBack = action.payload.isFallBack
        const games = sanitizeGames(action.payload.games, isFallBack)
        return {
          games,
          hasError: false,
          isLoading: false,
          lastUpdate: new Date(),
          urls: state.urls,
        }
      } catch (error) {
        // debug log here
        return {
          games: [],
          hasError: true,
          isLoading: false,
          lastUpdate: new Date(0),
          urls: state.urls,
        }
      }
    }
    case types.REQUEST_ERROR:
      return {
        games: [],
        hasError: true,
        isLoading: false,
        lastUpdate: new Date(0),
        urls: state.urls,
      }
    case types.UPDATE_VID: {
      const urls = action.payload
      return {
        ...state,
        urls: {
          ...state.urls,
          ...urls,
        },
      }
    }
    default:
      return state
  }
}
