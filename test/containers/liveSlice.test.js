import liveReducer, {
  gamesRequestFailed,
  gamesRequestStarted,
  gamesRequestSucceeded,
  highlightsUpdated,
  initialState,
} from '../../src/app/containers/Popup/liveSlice'
import { fetchGamesIfNeeded } from '../../src/app/containers/Popup/actions'
import { primaryGame } from '../fixtures/games'
import { restoreTime, useUtcTime } from '../support/time'

afterEach(() => {
  restoreTime()
  jest.restoreAllMocks()
  delete global.fetch
})

test('tracks live game loading, successful results, errors, and highlights', () => {
  useUtcTime('2024-01-01T12:00:00.000Z')

  const loading = liveReducer(undefined, gamesRequestStarted())
  const succeeded = liveReducer(
    loading,
    gamesRequestSucceeded({ games: [primaryGame()], isFallBack: 0 })
  )
  const highlighted = liveReducer(
    succeeded,
    highlightsUpdated({ [succeeded.games[0].id]: 'https://example.com/highlight' })
  )
  const failed = liveReducer(highlighted, gamesRequestFailed())

  expect(loading).toMatchObject({ hasError: false, isLoading: true })
  expect(succeeded).toMatchObject({
    hasError: false,
    isLoading: false,
    games: [expect.objectContaining({ id: 'primary-2' })],
    lastUpdate: new Date('2024-01-01T12:00:00.000Z'),
    urls: {},
  })
  expect(highlighted.urls).toEqual({
    'primary-2': 'https://example.com/highlight',
  })
  expect(failed).toEqual({
    hasError: true,
    isLoading: false,
    games: [],
    lastUpdate: new Date(0),
    urls: { 'primary-2': 'https://example.com/highlight' },
  })
})

test('treats invalid game data as a failed response while retaining highlights', () => {
  const state = { ...initialState, urls: { game: 'https://example.com/video' } }

  expect(liveReducer(state, gamesRequestSucceeded({ games: null }))).toEqual({
    hasError: true,
    isLoading: false,
    games: [],
    lastUpdate: new Date(0),
    urls: { game: 'https://example.com/video' },
  })
})

test('fetchGamesIfNeeded dispatches slice actions and preserves its callback', async () => {
  useUtcTime('2024-01-01T12:00:00.000Z')
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      scoreboard: { games: [primaryGame()], gameDate: '2024-01-01' },
    }),
  })
  const dispatch = jest.fn()
  const callback = jest.fn()
  const getState = () => ({
    live: initialState,
    date: { date: new Date('2024-01-01T00:00:00.000Z') },
  })

  await fetchGamesIfNeeded('20240101', callback, true, false)(
    dispatch,
    getState
  )

  expect(dispatch).toHaveBeenNthCalledWith(1, gamesRequestStarted())
  expect(dispatch).toHaveBeenNthCalledWith(
    2,
    gamesRequestSucceeded({
      isFallBack: 3,
      games: [primaryGame()],
    })
  )
  expect(callback).toHaveBeenCalledWith([primaryGame()])
})
