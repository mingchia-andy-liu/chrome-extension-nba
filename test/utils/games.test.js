import { sanitizeGames } from '../../src/app/utils/games'
import {
  fallback1Game,
  fallback2Game,
  fallback3Game,
  fallback5Game,
  primaryGame,
} from '../fixtures/games'

const sources = [
  { name: 'primary scoreboard', fallback: 0, create: primaryGame },
  { name: 'mobile scoreboard', fallback: 1, create: fallback1Game },
  { name: 'v2 scoreboard', fallback: 2, create: fallback2Game },
  { name: 'CDN scoreboard', fallback: 3, create: fallback3Game },
  { name: 'game-card feed', fallback: 5, create: fallback5Game },
]

describe.each(sources)('$name', ({ fallback, create }) => {
  test.each([1, 2, 3])('normalizes status %i', (status) => {
    const [game] = sanitizeGames([create(status)], fallback)

    expect(game.periodTime.gameStatus).toBe(`${status}`)
    expect(game.id).toBeDefined()
    expect(game.home).toBeDefined()
    expect(game.visitor).toBeDefined()
    expect(game.home.score).toBe('101')
    expect(game.visitor.score).toBe('99')
    expect(game.arena).toEqual(
      expect.objectContaining({ name: expect.any(String) })
    )
  })
})

test.each([
  ['mobile scoreboard', 1, fallback1Game, '08:00 PM ET'],
  ['v2 scoreboard', 2, fallback2Game, '12:30 AM'],
  ['CDN scoreboard', 3, fallback3Game, '12:30 AM'],
  ['game-card feed', 5, fallback5Game, '12:30 AM'],
])('%s uses its scheduled-time source', (_, fallback, create, expectedTime) => {
  const [game] = sanitizeGames([create(1)], fallback)

  expect(game.periodTime.periodStatus).toBe(expectedTime)
})

test('orders live, final, then scheduled games', () => {
  const games = sanitizeGames([primaryGame(1), primaryGame(3), primaryGame(2)])

  expect(games.map((game) => game.periodTime.gameStatus)).toEqual([
    '2',
    '3',
    '1',
  ])
})

test('normalizes primary broadcasters and playoff data', () => {
  const [game] = sanitizeGames([primaryGame(2)])

  expect(game).toEqual(
    expect.objectContaining({
      arena: { name: 'Crypto.com Arena', city: 'Los Angeles' },
      broadcasters: [{ scope: 'natl', display_name: 'ESPN' }],
      playoffs: { home_wins: 2, visitor_wins: 1 },
    })
  )
})

test('uses visitor linescores for the v2 scoreboard', () => {
  const [game] = sanitizeGames([fallback2Game(2)], 2)

  expect(game.home.linescores.period.map((period) => period.score)).toEqual([
    '20',
    '15',
    '18',
    '22',
  ])
  expect(game.visitor.linescores.period.map((period) => period.score)).toEqual([
    '18',
    '12',
    '21',
    '20',
  ])
})

test.each([
  ['postponed nugget', { nugget: { text: 'postponed' } }],
  ['postponed extended status', { extendedStatusNum: 2 }],
])('normalizes v2 %s games to PPD', (_, overrides) => {
  const [game] = sanitizeGames([fallback2Game(3, overrides)], 2)

  expect(game.periodTime.periodStatus).toBe('PPD')
})

test('normalizes v2 halftime and overtime statuses', () => {
  const [halftime] = sanitizeGames(
    [fallback2Game(2, { period: { current: 2, isHalftime: true } })],
    2
  )
  const [overtime] = sanitizeGames(
    [
      fallback2Game(2, {
        period: { current: 5, isHalftime: false, isEndOfPeriod: true },
      }),
    ],
    2
  )

  expect(halftime.periodTime.periodStatus).toBe('Halftime')
  expect(overtime.periodTime.periodStatus).toBe('End of 1 OT')
})

test('normalizes v2 regulation end-of-period and live overtime statuses', () => {
  const [endOfThird] = sanitizeGames(
    [
      fallback2Game(2, {
        period: { current: 3, isHalftime: false, isEndOfPeriod: true },
      }),
    ],
    2
  )
  const [liveOvertime] = sanitizeGames(
    [
      fallback2Game(2, {
        period: { current: 6, isHalftime: false, isEndOfPeriod: false },
      }),
    ],
    2
  )

  expect(endOfThird.periodTime.periodStatus).toBe('End of 3 Qtr')
  expect(liveOvertime.periodTime.periodStatus).toBe('2 OT')
})

test.each(['Delayed', 'Suspended'])(
  'preserves CDN %s status with an empty clock',
  (statusText) => {
    const [game] = sanitizeGames(
      [fallback3Game(2, { gameStatusText: statusText, gameClock: '' })],
      3
    )

    expect(game.periodTime).toMatchObject({
      periodStatus: statusText,
      gameClock: statusText,
    })
    expect(game.broadcasters).toEqual([])
  }
)

test('normalizes Half to Halftime for the CDN and game-card feeds', () => {
  const [cdn] = sanitizeGames(
    [fallback3Game(2, { gameStatusText: 'Half', gameClock: '' })],
    3
  )
  const [card] = sanitizeGames(
    [
      fallback5Game(2, {
        cardData: {
          ...fallback5Game().cardData,
          gameStatusText: 'Half',
          gameClock: '',
        },
      }),
    ],
    5
  )

  expect(cdn.periodTime.periodStatus).toBe('Halftime')
  expect(card.periodTime.periodStatus).toBe('Halftime')
})

test('normalizes CDN overtime clocks, broadcasters, and playoff records', () => {
  const [game] = sanitizeGames(
    [
      fallback3Game(2, {
        gameClock: 'PT01M02.50S',
        period: 5,
        playoffs: { hTeam: { seriesWin: 3 }, vTeam: { seriesWin: 2 } },
        watch: {
          broadcast: {
            broadcasters: {
              national: [{ shortName: 'ESPN' }],
              vTeam: [{ shortName: 'SNLA' }],
              hTeam: [{ shortName: 'BSOK' }],
            },
          },
        },
      }),
    ],
    3
  )

  expect(game.periodTime.gameClock).toBe('OT1 01:02')
  expect(game.broadcasters).toEqual([
    { scope: 'natl', display_name: 'ESPN' },
    { scope: 'local', display_name: 'SNLA' },
    { scope: 'local', display_name: 'BSOK' },
  ])
  expect(game.playoffs).toEqual({ home_wins: 3, visitor_wins: 2 })
})

test('uses status text for whitespace clocks and incomplete playoff data', () => {
  const [game] = sanitizeGames(
    [
      fallback3Game(2, {
        gameClock: '   ',
        gameStatusText: 'Delayed',
        playoffs: { hTeam: { seriesWin: 1 } },
      }),
    ],
    3
  )

  expect(game.periodTime.gameClock).toBe('Delayed')
  expect(game.playoffs).toBeUndefined()
})

test('normalizes game-card TBD teams and missing playoff data', () => {
  const card = fallback5Game().cardData
  const [game] = sanitizeGames(
    [
      fallback5Game(2, {
        cardData: { ...card, homeTeam: null, awayTeam: null, playoffs: null },
      }),
    ],
    5
  )

  expect(game.home).toMatchObject({ abbreviation: 'TBD', score: '0' })
  expect(game.visitor).toMatchObject({ abbreviation: 'TBD', score: '0' })
  expect(game.playoffs).toBeUndefined()
})
