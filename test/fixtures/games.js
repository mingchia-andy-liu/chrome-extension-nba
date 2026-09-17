const periods = (scores = [20, 15, 18, 22]) =>
  scores.map((score, index) => ({
    period: index + 1,
    periodType: 'REGULAR',
    score,
  }))

const legacyTeam = (abbreviation, score, lines = [20, 15, 18, 22]) => ({
  ta: abbreviation,
  tc: abbreviation === 'LAL' ? 'Los Angeles' : 'Boston',
  tn: abbreviation === 'LAL' ? 'Lakers' : 'Celtics',
  s: `${score}`,
  q1: lines[0],
  q2: lines[1],
  q3: lines[2],
  q4: lines[3],
  ot1: lines[4],
})

export const primaryGame = (status = 2, overrides = {}) => ({
  id: `primary-${status}`,
  date: '20240101',
  time: '0730',
  state: 'scheduled',
  arena: 'Crypto.com Arena',
  city: 'Los Angeles',
  broadcasters: {
    tv: { broadcaster: [{ scope: 'natl', display_name: 'ESPN' }] },
  },
  home: { abbreviation: 'LAL', score: '101' },
  visitor: { abbreviation: 'BOS', score: '99' },
  playoffs: { home_wins: 2, visitor_wins: 1 },
  period_time: {
    game_status: `${status}`,
    period_status: status === 3 ? 'Final' : '2nd Qtr',
    game_clock: '04:32',
    period_value: status === 1 ? '0' : '2',
  },
  ...overrides,
})

export const fallback1Game = (status = 2, overrides = {}) => ({
  gid: `fallback-1-${status}`,
  gcode: '20240101/LALBOS',
  st: status,
  stt: status === 1 ? '08:00 PM ET' : status === 3 ? 'Final' : '2nd Qtr',
  p: status === 1 ? 0 : 2,
  cl: status === 2 ? '04:32' : null,
  h: legacyTeam('LAL', 101),
  v: legacyTeam('BOS', 99, [18, 12, 21, 20]),
  playoffs: { home_wins: 2, visitor_wins: 1 },
  ...overrides,
})

const v2Team = (triCode, score, linescore) => ({
  triCode,
  score: `${score}`,
  linescore: linescore.map((value) => ({ score: `${value}` })),
})

export const fallback2Game = (status = 2, overrides = {}) => ({
  gameId: `fallback-2-${status}`,
  startDateEastern: '20240101',
  startTimeEastern: '07:30 PM ET',
  startTimeUTC: '2024-01-02T00:30:00Z',
  endTimeUTC: status === 3 ? '2024-01-02T03:00:00Z' : null,
  statusNum: status,
  extendedStatusNum: 0,
  clock: status === 2 ? '04:32' : '',
  arena: { name: 'Crypto.com Arena', city: 'Los Angeles' },
  period: {
    current: status === 1 ? 0 : 2,
    isHalftime: false,
    isEndOfPeriod: false,
  },
  hTeam: v2Team('LAL', 101, [20, 15, 18, 22]),
  vTeam: v2Team('BOS', 99, [18, 12, 21, 20]),
  watch: {
    broadcast: { broadcasters: { national: [], vTeam: [], hTeam: [] } },
  },
  playoffs: { hTeam: { seriesWin: 2 }, vTeam: { seriesWin: 1 } },
  nugget: null,
  ...overrides,
})

const v3Team = (teamId, teamTricode, teamName, score, scores) => ({
  teamId,
  teamTricode,
  teamName,
  score,
  wins: 20,
  losses: 10,
  periods: periods(scores),
})

export const fallback3Game = (status = 2, overrides = {}) => ({
  gameId: `fallback-3-${status}`,
  gameEt: '2024-01-01T19:30:00',
  gameTimeUTC: '2024-01-02T00:30:00Z',
  gameStatus: status,
  gameStatusText:
    status === 1 ? '7:30 pm ET' : status === 3 ? 'Final' : '2nd Qtr',
  period: status === 1 ? 0 : 2,
  gameClock: status === 2 ? 'PT04M32.00S' : '',
  homeTeam: v3Team(1610612747, 'LAL', 'Lakers', 101, [20, 15, 18, 22]),
  awayTeam: v3Team(1610612738, 'BOS', 'Celtics', 99, [18, 12, 21, 20]),
  watch: undefined,
  playoffs: { hTeam: { seriesWin: 2 }, vTeam: { seriesWin: 1 } },
  seriesText: 'LAL leads 2-1',
  ...overrides,
})

export const fallback5Game = (status = 2, overrides = {}) => ({
  cardData: {
    gameId: `fallback-5-${status}`,
    gameTimeEastern: '2024-01-01T19:30:00',
    gameTimeUtc: '2024-01-02T00:30:00Z',
    gameStatus: status,
    gameStatusText:
      status === 1 ? '7:30 pm ET' : status === 3 ? 'Final' : '2nd Qtr',
    period: status === 1 ? 0 : 2,
    gameClock: status === 2 ? 'PT04M32.00S' : '',
    homeTeam: v3Team(1610612747, 'LAL', 'Lakers', 101, [20, 15, 18, 22]),
    awayTeam: v3Team(1610612738, 'BOS', 'Celtics', 99, [18, 12, 21, 20]),
    playoffs: { hTeam: { seriesWin: 2 }, vTeam: { seriesWin: 1 } },
    seriesText: 'LAL leads 2-1',
  },
  ...overrides,
})
