import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {
  BoxScoreConsumer,
  BoxScoreProvider,
  SettingsConsumer,
  SettingsProvider,
  SidebarConsumer,
  SidebarProvider,
  ThemeConsumer,
  ThemeProvider,
} from '../../src/app/components/Context'
import {
  BroadcastCheckbox,
  ChronologicalCheckbox,
  DarkModeCheckbox,
  HideZeroRowCheckbox,
  NoSpoilerCheckbox,
} from '../../src/app/components/Checkbox'
import FavoritePlayers from '../../src/app/components/FavoritePlayers'
import FavoriteTeams from '../../src/app/components/FavoriteTeams'
import MatchInfo from '../../src/app/components/MatchInfo'
import Options from '../../src/app/containers/Options'
import { players } from '../../src/app/utils/players'

let mockStorage = {}
const mockGetItem = jest.fn()
const mockSetItem = jest.fn()
const mockContainsPermission = jest.fn()
const mockRequestPermission = jest.fn()
const mockRemovePermission = jest.fn()
const mockCreateNotification = jest.fn()

jest.mock('../../src/app/utils/browser', () => ({
  __esModule: true,
  default: {
    getItem: (...args) => mockGetItem(...args),
    setItem: (...args) => mockSetItem(...args),
    permissions: {
      contains: (...args) => mockContainsPermission(...args),
      request: (...args) => mockRequestPermission(...args),
      remove: (...args) => mockRemovePermission(...args),
    },
    notifications: { create: (...args) => mockCreateNotification(...args) },
  },
}))

const renderWithProviders = (children) =>
  render(
    <ThemeProvider>
      <SettingsProvider>
        <SidebarProvider>
          <BoxScoreProvider>{children}</BoxScoreProvider>
        </SidebarProvider>
      </SettingsProvider>
    </ThemeProvider>
  )

const waitForHydration = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

beforeEach(() => {
  mockStorage = {}
  jest.clearAllMocks()
  mockGetItem.mockImplementation((_, callback) => {
    setTimeout(() => callback(mockStorage), 0)
  })
  mockContainsPermission.mockImplementation((_, callback) => callback(false))
  mockRequestPermission.mockImplementation((_, callback) => callback(true))
  mockRemovePermission.mockImplementation((_, callback) => callback(true))
  document.documentElement.style.cssText = ''
})

test('hydrates settings defaults before stored preferences and persists changes', () => {
  let hydrate
  mockGetItem.mockImplementation((_, callback) => {
    hydrate = callback
  })

  render(
    <SettingsProvider>
      <SettingsConsumer>
        {({ state, actions }) => (
          <button
            onClick={actions.updateNoSpoiler}
          >{`${state.spoiler}`}</button>
        )}
      </SettingsConsumer>
    </SettingsProvider>
  )

  expect(screen.getByRole('button')).toHaveTextContent('false')

  act(() => hydrate({ spoiler: true }))
  expect(screen.getByRole('button')).toHaveTextContent('true')

  fireEvent.click(screen.getByRole('button'))
  expect(mockSetItem).toHaveBeenCalledWith({ spoiler: false })
})

test('hydrates and persists the theme while updating CSS custom properties', async () => {
  let hydrate
  mockGetItem.mockImplementation((_, callback) => {
    hydrate = callback
  })

  render(
    <ThemeProvider>
      <ThemeConsumer>
        {({ state, actions }) => (
          <button onClick={actions.updateTheme}>{`${state.dark}`}</button>
        )}
      </ThemeConsumer>
    </ThemeProvider>
  )

  expect(screen.getByRole('button')).toHaveTextContent('false')
  act(() => hydrate({ nightMode: true }))
  expect(screen.getByRole('button')).toHaveTextContent('true')
  expect(
    document.documentElement.style.getPropertyValue('--bg-color')
  ).not.toBe('')

  fireEvent.click(screen.getByRole('button'))
  expect(mockSetItem).toHaveBeenCalledWith({ nightMode: false })
  expect(
    document.documentElement.style.getPropertyValue('--bg-color')
  ).not.toBe('')
})

test('hydrates and persists sidebar preferences', async () => {
  let hydrate
  mockGetItem.mockImplementation((_, callback) => {
    hydrate = callback
  })

  render(
    <SidebarProvider>
      <SidebarConsumer>
        {({ state, actions }) => (
          <>
            <output>{JSON.stringify(state)}</output>
            <button onClick={actions.updateBroadcast}>broadcast</button>
            <button onClick={actions.updateChronological}>chronological</button>
            <button onClick={() => actions.updateFavouriteTeams(['BOS'])}>
              teams
            </button>
          </>
        )}
      </SidebarConsumer>
    </SidebarProvider>
  )

  expect(screen.getByRole('status')).toHaveTextContent('"teams":[]')
  act(() =>
    hydrate({ broadcast: true, chronological: true, favTeams: ['LAL'] })
  )
  expect(screen.getByRole('status')).toHaveTextContent('"teams":["LAL"]')
  fireEvent.click(screen.getByRole('button', { name: 'broadcast' }))
  fireEvent.click(screen.getByRole('button', { name: 'chronological' }))
  fireEvent.click(screen.getByRole('button', { name: 'teams' }))

  expect(mockSetItem).toHaveBeenCalledWith({ broadcast: false })
  expect(mockSetItem).toHaveBeenCalledWith({ chronological: false })
  expect(mockSetItem).toHaveBeenCalledWith({ favTeams: ['BOS'] })
})

test('hydrates box-score preferences and preserves favorite-player JSON storage', async () => {
  const favPlayers = [{ PERSON_ID: '2544', PLAYER_FIRST_NAME: 'LeBron' }]
  let hydrate
  mockGetItem.mockImplementation((_, callback) => {
    hydrate = callback
  })

  render(
    <BoxScoreProvider>
      <BoxScoreConsumer>
        {({ state, actions }) => (
          <>
            <output>{JSON.stringify(state)}</output>
            <button onClick={actions.updateHideZeroRow}>hide</button>
            <button onClick={() => actions.updateFavPlayers([])}>
              players
            </button>
          </>
        )}
      </BoxScoreConsumer>
    </BoxScoreProvider>
  )

  expect(screen.getByRole('status')).toHaveTextContent('"hideZeroRow":false')
  act(() =>
    hydrate({ hideZeroRow: true, favPlayers: JSON.stringify(favPlayers) })
  )
  expect(screen.getByRole('status')).toHaveTextContent('"hideZeroRow":true')
  expect(screen.getByRole('status')).toHaveTextContent('"PERSON_ID":"2544"')
  fireEvent.click(screen.getByRole('button', { name: 'hide' }))
  fireEvent.click(screen.getByRole('button', { name: 'players' }))

  expect(mockSetItem).toHaveBeenCalledWith({ hideZeroRow: false })
  expect(mockSetItem).toHaveBeenCalledWith({ favPlayers: '[]' })
})

test('handles invalid favorite-player storage by using defaults', async () => {
  mockStorage = { favPlayers: 'not json' }

  render(
    <BoxScoreProvider>
      <BoxScoreConsumer>
        {({ state }) => <output>{JSON.stringify(state.favPlayers)}</output>}
      </BoxScoreConsumer>
    </BoxScoreProvider>
  )

  await waitForHydration()

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('[]')
  })
})

test('checkbox controls update their corresponding preferences', async () => {
  renderWithProviders(
    <>
      <DarkModeCheckbox />
      <NoSpoilerCheckbox />
      <HideZeroRowCheckbox />
      <BroadcastCheckbox />
      <ChronologicalCheckbox />
    </>
  )

  await waitForHydration()

  fireEvent.click(screen.getByRole('checkbox', { name: 'Dark mode' }))
  fireEvent.click(screen.getByRole('checkbox', { name: 'No spoiler' }))
  fireEvent.click(
    screen.getByRole('checkbox', { name: 'Hide Player Who Has Not Played' })
  )
  fireEvent.click(screen.getByRole('checkbox', { name: 'Show Broadcasters' }))
  fireEvent.click(
    screen.getByRole('checkbox', { name: 'Sort by chronological for games' })
  )

  expect(mockSetItem).toHaveBeenCalledWith({ nightMode: true })
  expect(mockSetItem).toHaveBeenCalledWith({ spoiler: true })
  expect(mockSetItem).toHaveBeenCalledWith({ hideZeroRow: true })
  expect(mockSetItem).toHaveBeenCalledWith({ broadcast: true })
  expect(mockSetItem).toHaveBeenCalledWith({ chronological: true })
})

test('favorite-team and favorite-player controls persist selected values', async () => {
  const player = players[0]
  const playerName = `${player.PLAYER_FIRST_NAME} ${player.PLAYER_LAST_NAME}`

  renderWithProviders(
    <>
      <FavoriteTeams />
      <FavoritePlayers />
    </>
  )

  await waitForHydration()

  fireEvent.change(screen.getAllByRole('combobox')[0], {
    target: { value: 'Los Angeles Lakers' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Add Team' }))
  fireEvent.change(screen.getAllByRole('combobox')[1], {
    target: { value: playerName },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Add Name' }))

  expect(mockSetItem).toHaveBeenCalledWith({ favTeams: ['LAL'] })
  expect(mockSetItem).toHaveBeenCalledWith({
    favPlayers: JSON.stringify([player]),
  })
})

test('options renders all preference controls', async () => {
  renderWithProviders(
    <MemoryRouter>
      <Options />
    </MemoryRouter>
  )

  await waitForHydration()

  expect(
    screen.getByRole('checkbox', { name: 'No spoiler' })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('checkbox', { name: 'Dark mode' })
  ).toBeInTheDocument()
  expect(
    screen.getByRole('checkbox', { name: 'Show Broadcasters' })
  ).toBeInTheDocument()
})

test('no-spoiler hides live scores until revealed', async () => {
  mockStorage = { spoiler: true }
  const setReveal = jest.fn()

  renderWithProviders(
    <MatchInfo
      id="game-1"
      broadcasters={[]}
      home={{ abbreviation: 'LAL', nickname: 'Lakers', score: '101' }}
      visitor={{ abbreviation: 'BOS', nickname: 'Celtics', score: '99' }}
      periodTime={{
        periodStatus: '2 Qtr of',
        gameClock: '04:32',
        gameStatus: '2',
        periodValue: '2',
      }}
      urls={{}}
      reveal={false}
      setReveal={setReveal}
    />
  )

  await waitForHydration()

  await waitFor(() => {
    expect(screen.queryByText('101')).not.toBeInTheDocument()
    expect(screen.queryByText('99')).not.toBeInTheDocument()
  })
  fireEvent.click(screen.getByRole('button', { name: 'Reveal' }))
  expect(setReveal).toHaveBeenCalledWith(true)
})
