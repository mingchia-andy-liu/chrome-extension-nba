const statistics = (overrides = {}) => ({
  assists: 7,
  benchPoints: 18,
  biggestLead: 12,
  blocks: 4,
  fastBreakPointsAttempted: 8,
  fastBreakPointsMade: 5,
  fieldGoalsAttempted: 80,
  fieldGoalsMade: 40,
  foulsPersonal: 16,
  foulsTeam: 2,
  freeThrowsAttempted: 20,
  freeThrowsMade: 15,
  leadChanges: 6,
  points: 101,
  pointsFastBreak: 10,
  pointsFromTurnovers: 14,
  pointsInThePaint: 42,
  pointsInThePaintAttempted: 60,
  pointsInThePaintMade: 21,
  pointsSecondChance: 11,
  reboundsDefensive: 30,
  reboundsOffensive: 10,
  reboundsTeam: 2,
  steals: 5,
  threePointersAttempted: 30,
  threePointersMade: 10,
  timesTied: 4,
  turnovers: 12,
  turnoversTeam: 1,
  ...overrides,
})

const player = (overrides = {}) => ({
  familyName: 'Gilgeous-Alexander',
  firstName: 'Shai',
  oncourt: true,
  personId: '1628983',
  position: 'G',
  statistics: statistics({
    fieldGoalsAttempted: 0,
    fieldGoalsMade: 0,
    freeThrowsAttempted: 0,
    freeThrowsMade: 0,
    minutes: 'PT04M32.00S',
    plusMinusPoints: 8,
    points: 10,
    threePointersAttempted: 0,
    threePointersMade: 0,
  }),
  ...overrides,
})

const team = (details, overrides = {}) => ({
  periods: [{ score: 25 }, { score: 26 }, { score: 24 }, { score: 26 }],
  players: [player()],
  score: 101,
  statistics: statistics(),
  ...details,
  ...overrides,
})

export const activeBoxScore = (overrides = {}) => ({
  arena: { arenaCity: 'Oklahoma City', arenaName: 'Paycom Center' },
  awayTeam: team(
    {
      teamCity: 'Los Angeles',
      teamId: 1610612747,
      teamName: 'Lakers',
      teamTricode: 'LAL',
    },
    {
      players: [
        player({
          familyName: '',
          firstName: 'Nene',
          oncourt: '0',
          personId: '2403',
          statistics: statistics({ minutes: 'PT00M05.50S' }),
        }),
      ],
      score: 99,
      statistics: statistics({ points: 99 }),
    }
  ),
  gameClock: 'PT04M32.00S',
  gameStatus: 2,
  gameStatusText: '2nd Qtr',
  homeTeam: team({
    teamCity: 'Oklahoma City',
    teamId: 1610612760,
    teamName: 'Thunder',
    teamTricode: 'OKC',
  }),
  officials: [{ familyName: 'Foster', firstName: 'Scott', personId: 101 }],
  period: 2,
  ...overrides,
})
