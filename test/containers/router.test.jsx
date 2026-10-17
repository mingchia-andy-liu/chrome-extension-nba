import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../../src/app/containers/App/App'
import PopUp from '../../src/app/containers/Popup/PopUp'
import { Sidebar } from '../../src/app/containers/Sidebar/Sidebar'
import { fetchLiveGameBoxIfNeeded } from '../../src/app/containers/BoxScoresDetails/boxScoresDetailsSlice'
import {
  fetchGameHighlightIfNeeded,
  fetchGamesIfNeeded,
} from '../../src/app/containers/Popup/actions'
import { createAppStore } from '../support/stores'

jest.mock('flatpickr/dist/flatpickr.min.css', () => ({}))
jest.mock('../../src/app/containers/Popup', () => () => <div>Popup</div>)
jest.mock('../../src/app/containers/BoxScores', () => () => (
  <div>Box Scores</div>
))
jest.mock('../../src/app/components/Links', () => () => null)
jest.mock('../../src/app/containers/Standings', () => () => (
  <div>Standings</div>
))
jest.mock('../../src/app/containers/Options', () => () => <div>Options</div>)
jest.mock('../../src/app/containers/Changelog', () => () => (
  <div>Changelog</div>
))
jest.mock('../../src/app/containers/Playoffs', () => () => <div>Playoffs</div>)
jest.mock('../../src/app/containers/Popup/actions', () => ({
  fetchGameHighlightIfNeeded: jest.fn(() => () => Promise.resolve()),
  fetchGamesIfNeeded: jest.fn(() => () => Promise.resolve()),
}))
jest.mock('../../src/app/components/Context', () => ({
  BoxScoreProvider: ({ children }) => children,
  SettingsProvider: ({ children }) => children,
  SidebarProvider: ({ children }) => children,
  ThemeProvider: ({ children }) => children,
}))
jest.mock('../../src/app/components/CardList', () => ({ onClick }) => (
  <button data-id="123" onClick={onClick}>
    Select game
  </button>
))
jest.mock('../../src/app/containers/DatePicker', () => () => null)
jest.mock('../../src/app/components/Checkbox', () => ({
  BroadcastCheckbox: () => null,
  DarkModeCheckbox: () => null,
  NoSpoilerCheckbox: () => null,
}))

const Location = () => <output>{useLocation().pathname}</output>
const LocationWithSearch = () => {
  const location = useLocation()
  return <output>{`${location.pathname}${location.search}`}</output>
}

const renderApp = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <Location />
    </MemoryRouter>
  )

const stateWithNoGames = {
  bs: { bsData: {}, gid: '' },
  date: { date: new Date('2024-01-01T12:00:00.000Z') },
  live: { games: [], isLoading: false, lastUpdate: new Date(0) },
}

test('redirects unknown routes to the popup', () => {
  renderApp('/unknown')

  expect(screen.getByText('Popup')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('/popup')
})

test('matches box-score detail routes', () => {
  renderApp('/boxscores/123')

  expect(screen.getByText('Box Scores')).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('/boxscores/123')
})

test('redirects an invalid game through the component navigator', async () => {
  const navigate = jest.fn()

  await fetchLiveGameBoxIfNeeded(
    '20240101',
    'missing',
    false,
    navigate
  )(jest.fn(), () => stateWithNoGames)

  expect(navigate).toHaveBeenCalledWith('/boxscores')
})

test('redirects an invalid game through the hash fallback', async () => {
  window.location.hash = ''

  await fetchLiveGameBoxIfNeeded('20240101', 'missing')(
    jest.fn(),
    () => stateWithNoGames
  )

  expect(window.location.hash).toBe('#/boxscores')
})

test('popup fetches the selected date and then its highlights from the store', async () => {
  const store = createAppStore({
    ...createAppStore().getState(),
    date: { date: new Date('2024-01-01T12:00:00.000Z') },
  })

  render(
    <Provider store={store}>
      <MemoryRouter>
        <PopUp />
      </MemoryRouter>
    </Provider>
  )

  await waitFor(() => expect(fetchGameHighlightIfNeeded).toHaveBeenCalledWith())
  expect(fetchGamesIfNeeded).toHaveBeenCalledWith('20240101', null, true)
  expect(document.title).toBe('Box Scores | Popup')
})

test('sidebar fetches store-selected games and selecting one only changes the route', async () => {
  const store = createAppStore({
    ...createAppStore().getState(),
    date: { date: new Date('2024-01-01T12:00:00.000Z') },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/boxscores']}>
        <Sidebar id="" />
        <Location />
      </MemoryRouter>
    </Provider>
  )

  await waitFor(() => expect(fetchGameHighlightIfNeeded).toHaveBeenCalledWith())
  expect(fetchGamesIfNeeded).toHaveBeenCalledWith('20240101', null, true, false)

  fireEvent.click(screen.getByRole('button', { name: 'Select game' }))

  expect(screen.getByRole('status')).toHaveTextContent('/boxscores/123')
})

test('sidebar clears an invalid date query and uses the selected date', async () => {
  const store = createAppStore({
    ...createAppStore().getState(),
    date: { date: new Date('2024-01-01T12:00:00.000Z') },
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/boxscores?date=not-a-date']}>
        <Sidebar id="" />
        <LocationWithSearch />
      </MemoryRouter>
    </Provider>
  )

  await waitFor(() =>
    expect(fetchGamesIfNeeded).toHaveBeenCalledWith(
      '20240101',
      null,
      true,
      false
    )
  )
  expect(screen.getByRole('status')).toHaveTextContent('/boxscores')
})
