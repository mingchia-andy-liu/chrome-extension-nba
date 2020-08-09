import types from './types'
import { sanitizeGames } from '../../utils/gameSanitize'

const initState = {
  hasError: false,
  isLoading: true,
  games: [],
  lastUpdate: new Date(0),
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
        }
      } catch (error) {
        return {
          games: [],
          hasError: true,
          isLoading: false,
          lastUpdate: new Date(0),
        }
      }
    }
    case types.REQUEST_ERROR:
      return {
        games: [],
        hasError: true,
        isLoading: false,
        lastUpdate: new Date(0),
      }
    default:
      return state
  }
}
