import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { createAppStore } from '../support/stores'
import Standings from '../../src/app/containers/Standings'
import Playoffs from '../../src/app/containers/Playoffs'
import BoxScoresDetails from '../../src/app/containers/BoxScoresDetails'
import {
  transformStandings,
  useGetStandingsQuery,
} from '../../src/app/containers/Standings/api'
import {
  transformPlayoffs,
  useGetPlayoffsQuery,
} from '../../src/app/containers/Playoffs/api'
import {
  fetchLiveGameBoxIfNeeded,
  resetLiveGameBox,
} from '../../src/app/containers/BoxScoresDetails/actions'

jest.mock('../../src/app/components/Context', () => ({
  SettingsConsumer: ({ children }) => children({ state: { spoiler: false } }),
  ThemeConsumer: ({ children }) => children({ state: { dark: false } }),
}))

jest.mock('../../src/app/containers/Standings/api', () => {
  const actual = jest.requireActual('../../src/app/containers/Standings/api')
  return {
    ...actual,
    useGetStandingsQuery: jest.fn(),
  }
})

jest.mock('../../src/app/containers/Playoffs/api', () => {
  const actual = jest.requireActual('../../src/app/containers/Playoffs/api')
  return {
    ...actual,
    useGetPlayoffsQuery: jest.fn(),
  }
})

jest.mock('../../src/app/containers/BoxScoresDetails/actions', () => ({
  fetchLiveGameBoxIfNeeded: jest.fn(() => ({ type: 'TEST_FETCH_BOX_SCORE' })),
  resetLiveGameBox: jest.fn(() => ({ type: 'TEST_RESET_BOX_SCORE' })),
}))

const defaultState = createAppStore().getState()

const renderView = (view, state, path) =>
  render(
    <Provider store={createAppStore({ ...defaultState, ...state })}>
      <MemoryRouter initialEntries={[path]}>{view}</MemoryRouter>
    </Provider>
  )

const team = (id, name) => ({
  gamesBehind: '0',
  homeRecord: '1-0',
  id,
  lastTenRecord: '1-0',
  loss: 0,
  name,
  awayRecord: '0-0',
  percentage: 1,
  playoffCode: 'x',
  streak: 1,
  win: 1,
})

const series = {
  bottomRow: { seedNum: 8, teamId: '1610612747', wins: 0 },
  confName: 'West',
  isGameLive: false,
  roundNum: 1,
  seriesId: 'west-rd1',
  summaryStatusText: 'Lakers lead 1-0',
  topRow: { seedNum: 1, teamId: '1610612744', wins: 1 },
}

afterEach(() => {
  jest.clearAllMocks()
})

test('requests standings and renders its loading state', () => {
  useGetStandingsQuery.mockReturnValue({
    data: undefined,
    isLoading: true,
  })

  renderView(<Standings />, {}, '/standings')

  expect(useGetStandingsQuery).toHaveBeenCalled()
  expect(
    screen.getByRole('heading', { name: 'Loading...' })
  ).toBeInTheDocument()
})

test('renders populated standings with ranks and team names', () => {
  useGetStandingsQuery.mockReturnValue({
    data: {
      east: [team('1610612738', 'Celtics')],
      west: [team('1610612747', 'Lakers')],
    },
    isLoading: false,
  })

  renderView(<Standings />, {}, '/standings')

  expect(screen.getByRole('heading', { name: 'East' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'West' })).toBeInTheDocument()
  expect(screen.getAllByText('1- x')).toHaveLength(2)
  expect(screen.getByText('Celtics')).toBeInTheDocument()
  expect(screen.getByText('Lakers')).toBeInTheDocument()
})

test('renders a retryable standings error', () => {
  const refetch = jest.fn()
  useGetStandingsQuery.mockReturnValue({
    data: undefined,
    isError: true,
    isLoading: false,
    refetch,
  })

  renderView(<Standings />, {}, '/standings')

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Unable to load standings.'
  )
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(refetch).toHaveBeenCalledTimes(1)
})

test('transforms standings API rows by conference', () => {
  const row = (id, name) => {
    const values = []
    values[2] = id
    values[4] = name
    values[9] = 'x'
    values[13] = 1
    values[14] = 0
    values[15] = 1
    values[18] = '1-0'
    values[19] = '0-0'
    values[20] = '1-0'
    values[36] = 1
    values[38] = '0'
    return values
  }

  expect(
    transformStandings({
      resultSets: [
        {
          rowSet: [row('1610612738', 'Celtics'), row('1610612747', 'Lakers')],
        },
      ],
    })
  ).toMatchObject({
    east: [{ id: '1610612738', name: 'Celtics' }],
    west: [{ id: '1610612747', name: 'Lakers' }],
  })
})

test('requests playoff data and renders its loading state', () => {
  useGetPlayoffsQuery.mockReturnValue({ data: undefined, isLoading: true })

  renderView(<Playoffs />, {}, '/playoffs')

  expect(useGetPlayoffsQuery).toHaveBeenCalled()
  expect(
    screen.getByRole('heading', { name: 'Loading...' })
  ).toBeInTheDocument()
})

test('renders bracket round labels, teams, and a series summary', () => {
  useGetPlayoffsQuery.mockReturnValue({ data: [series], isLoading: false })

  renderView(<Playoffs />, {}, '/playoffs')

  expect(screen.getAllByRole('heading', { name: 'RD1' })).toHaveLength(2)
  expect(screen.getByRole('heading', { name: 'FIN' })).toBeInTheDocument()
  expect(screen.getByText('Warriors')).toBeInTheDocument()
  expect(screen.getByText('Lakers')).toBeInTheDocument()
  expect(screen.getByText('Lakers lead 1-0')).toBeInTheDocument()
})

test('renders a retryable playoffs error', () => {
  const refetch = jest.fn()
  useGetPlayoffsQuery.mockReturnValue({
    data: undefined,
    isError: true,
    isLoading: false,
    refetch,
  })

  renderView(<Playoffs />, {}, '/playoffs')

  expect(screen.getByRole('alert')).toHaveTextContent('Unable to load playoffs.')
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(refetch).toHaveBeenCalledTimes(1)
})

test('transforms playoff API series for the bracket', () => {
  expect(
    transformPlayoffs({
      bracket: {
        playoffBracketSeries: [
          {
            highSeedId: '1610612744',
            highSeedRank: 1,
            highSeedSeriesWins: 4,
            lowSeedId: '1610612747',
            lowSeedRank: 8,
            lowSeedSeriesWins: 1,
            nextGameNumber: 5,
            nextGameStatus: 2,
            roundNumber: 1,
            seriesConference: 'West',
            seriesId: 'west-rd1',
            seriesStatus: 2,
            seriesText: 'Warriors win 4-1',
          },
        ],
      },
    })
  ).toEqual([
    expect.objectContaining({
      confName: 'West',
      isGameLive: true,
      isSeriesCompleted: true,
      roundNum: 1,
      seriesId: 'west-rd1',
      topRow: expect.objectContaining({ isSeriesWinner: true }),
    }),
  ])
})

test('requests a box score and renders its loading state', () => {
  renderView(
    <BoxScoresDetails id="123" date={new Date('2024-01-01T12:00:00.000Z')} />,
    {
      bs: { bsData: {}, isLoading: true, pbpData: {}, teamStats: {} },
    },
    '/boxscores/123'
  )

  expect(fetchLiveGameBoxIfNeeded).toHaveBeenCalledWith(
    '20240101',
    '123',
    false,
    expect.any(Function)
  )
  expect(
    screen.getByRole('heading', { name: 'Loading...' })
  ).toBeInTheDocument()
})

test('renders the pre-game box-score overlay after loading', () => {
  const { unmount } = renderView(
    <BoxScoresDetails id="123" date={new Date('2024-01-01T12:00:00.000Z')} />,
    {
      bs: {
        bsData: { periodTime: { gameStatus: '1' } },
        isLoading: false,
        pbpData: {},
        teamStats: {},
      },
    },
    '/boxscores/123'
  )

  expect(
    screen.getByRole('heading', { name: 'Game has not started' })
  ).toBeInTheDocument()
  unmount()
  expect(resetLiveGameBox).toHaveBeenCalledTimes(1)
})
