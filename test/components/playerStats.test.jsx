import React from 'react'
import { render, screen } from '@testing-library/react'
import PlayerStats from '../../src/app/components/Scores/PlayerStats'

jest.mock('../../src/app/components/Context', () => ({
  BoxScoreConsumer: ({ children }) =>
    children({ state: { favPlayers: [], hideZeroRow: false } }),
  ThemeConsumer: ({ children }) => children({ state: { dark: false } }),
}))

const player = (overrides) => ({
  assists: 6,
  blocks: 1,
  fantasy_points: 30,
  field_goals_attempted: 12,
  field_goals_made: 6,
  first_name: 'Shai',
  fouls: 2,
  free_throws_attempted: 4,
  free_throws_made: 3,
  last_name: 'Gilgeous-Alexander',
  minutes: '31',
  on_court: 0,
  personId: '1628983',
  plus_minus: 4,
  points: 18,
  rebounds_defensive: 4,
  rebounds_offensive: 1,
  seconds: '0',
  steals: 2,
  three_pointers_attempted: 5,
  three_pointers_made: 2,
  turnovers: 3,
  ...overrides,
})

test('renders player names and the live on-court indicator', () => {
  const { container } = render(
    <PlayerStats
      hps={[player({ on_court: 1 })]}
      hta="Thunder"
      hts={{}}
      isLive={true}
      vps={[player({ first_name: 'Nene', last_name: '', personId: '2403' })]}
      vta="Visitors"
      vts={{}}
    />
  )

  expect(screen.getByText('Nene')).toBeInTheDocument()
  expect(screen.getByText('S. Gilgeous-Alexander')).toBeInTheDocument()
  expect(
    container.querySelector('img[src="assets/png/icon-color-128.png"]')
  ).toBeInTheDocument()
})
