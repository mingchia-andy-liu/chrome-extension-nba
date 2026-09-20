import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { createAppStore } from '../support/stores'
import Standings from '../../src/app/containers/Standings'
import Playoffs from '../../src/app/containers/Playoffs'
import BoxScoresDetails from '../../src/app/containers/BoxScoresDetails'
import * as standingsActions from '../../src/app/containers/Standings/actions'
import * as playoffActions from '../../src/app/containers/Playoffs/actions'
import {
  fetchLiveGameBoxIfNeeded,
  resetLiveGameBox,
} from '../../src/app/containers/BoxScoresDetails/actions'

jest.mock('../../src/app/components/Context', () => ({
  SettingsConsumer: ({ children }) => children({ state: { spoiler: false } }),
  ThemeConsumer: ({ children }) => children({ state: { dark: false } }),
}))

jest.mock('../../src/app/containers/Standings/actions', () => ({
  fetchStandings: jest.fn(() => ({ type: 'TEST_FETCH_STANDINGS' })),
}))

jest.mock('../../src/app/containers/Playoffs/actions', () => ({
  fetchPlayoff: jest.fn(() => ({ type: 'TEST_FETCH_PLAYOFF' })),
}))

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
  renderView(
    <Standings />,
    { standings: { east: [], isLoading: true, west: [] } },
    '/standings'
  )

  expect(standingsActions.fetchStandings).toHaveBeenCalledTimes(1)
  expect(
    screen.getByRole('heading', { name: 'Loading...' })
  ).toBeInTheDocument()
})

test('renders populated standings with ranks and team names', () => {
  renderView(
    <Standings />,
    {
      standings: {
        east: [team('1610612738', 'Celtics')],
        isLoading: false,
        west: [team('1610612747', 'Lakers')],
      },
    },
    '/standings'
  )

  expect(screen.getByRole('heading', { name: 'East' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'West' })).toBeInTheDocument()
  expect(screen.getAllByText('1- x')).toHaveLength(2)
  expect(screen.getByText('Celtics')).toBeInTheDocument()
  expect(screen.getByText('Lakers')).toBeInTheDocument()
})

test('requests playoff data and renders its loading state', () => {
  renderView(
    <Playoffs />,
    { playoff: { isLoading: true, series: [] } },
    '/playoffs'
  )

  expect(playoffActions.fetchPlayoff).toHaveBeenCalledTimes(1)
  expect(
    screen.getByRole('heading', { name: 'Loading...' })
  ).toBeInTheDocument()
})

test('renders bracket round labels, teams, and a series summary', () => {
  renderView(
    <Playoffs />,
    { playoff: { isLoading: false, series: [series] } },
    '/playoffs'
  )

  expect(screen.getAllByRole('heading', { name: 'RD1' })).toHaveLength(2)
  expect(screen.getByRole('heading', { name: 'FIN' })).toBeInTheDocument()
  expect(screen.getByText('Warriors')).toBeInTheDocument()
  expect(screen.getByText('Lakers')).toBeInTheDocument()
  expect(screen.getByText('Lakers lead 1-0')).toBeInTheDocument()
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
    false
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
