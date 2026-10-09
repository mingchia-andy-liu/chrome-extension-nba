import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../../src/app/containers/App/App'
import { Sidebar } from '../../src/app/containers/Sidebar/Sidebar'
import { fetchLiveGameBoxIfNeeded } from '../../src/app/containers/BoxScoresDetails/actions'
import { createAppStore } from '../support/stores'

jest.mock('flatpickr/dist/flatpickr.min.css', () => ({}))
jest.mock('../../src/app/containers/Popup', () => () => <div>Popup</div>)
jest.mock('../../src/app/containers/BoxScores', () => () => (
  <div>Box Scores</div>
))
jest.mock('../../src/app/containers/Standings', () => () => (
  <div>Standings</div>
))
jest.mock('../../src/app/containers/Options', () => () => <div>Options</div>)
jest.mock('../../src/app/containers/Changelog', () => () => (
  <div>Changelog</div>
))
jest.mock('../../src/app/containers/Playoffs', () => () => <div>Playoffs</div>)
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

  await fetchLiveGameBoxIfNeeded('20240101', 'missing', false, navigate)(
    jest.fn(),
    () => stateWithNoGames
  )

  expect(navigate).toHaveBeenCalledWith('/boxscores')
})

test('redirects an invalid game through the hash fallback', async () => {
  window.location.hash = ''

  await fetchLiveGameBoxIfNeeded('20240101', 'missing')(jest.fn(), () =>
    stateWithNoGames
  )

  expect(window.location.hash).toBe('#/boxscores')
})

test('selecting a sidebar game only changes the route', () => {
  const fetchLiveGameBox = jest.fn()

  render(
    <Provider store={createAppStore()}>
      <MemoryRouter initialEntries={['/boxscores']}>
        <Sidebar
          date={new Date('2024-01-01T12:00:00.000Z')}
          fetchGameHighlightIfNeeded={jest.fn()}
          fetchGamesIfNeeded={jest.fn(() => Promise.resolve())}
          fetchLiveGameBoxIfNeeded={fetchLiveGameBox}
          id=""
          live={{ games: [], hasError: false, isLoading: false, urls: {} }}
        />
        <Location />
      </MemoryRouter>
    </Provider>
  )

  fireEvent.click(screen.getByRole('button', { name: 'Select game' }))

  expect(screen.getByRole('status')).toHaveTextContent('/boxscores/123')
  expect(fetchLiveGameBox).not.toHaveBeenCalled()
})
