import { convertBS, convertBSProxy } from '../../src/app/utils/convert'
import reducer, {
  fetchLiveGameBox,
  fetchLiveGameBoxIfNeeded,
  resetLiveGameBox,
} from '../../src/app/containers/BoxScoresDetails/boxScoresDetailsSlice'
import { activeBoxScore } from '../fixtures/boxScores'

test('normalizes active CDN box scores, players, and zero-attempt statistics', () => {
  const boxScore = activeBoxScore()
  boxScore.homeTeam.statistics = {
    ...boxScore.homeTeam.statistics,
    fieldGoalsAttempted: 0,
    fieldGoalsMade: 0,
    freeThrowsAttempted: 0,
    freeThrowsMade: 0,
    threePointersAttempted: 0,
    threePointersMade: 0,
  }
  const converted = convertBSProxy(boxScore)

  expect(converted.officials).toEqual([
    { first_name: 'Scott', last_name: 'Foster', person_id: 101 },
  ])
  expect(converted.arena).toEqual({
    city: 'Oklahoma City',
    name: 'Paycom Center',
  })
  expect(converted.home).toMatchObject({
    abbreviation: 'OKC',
    id: 1610612760,
    nickname: 'Thunder',
    score: 101,
  })
  expect(
    converted.home.linescores.period.map((period) => period.score)
  ).toEqual([25, 26, 24, 26])
  expect(converted.home.players.player[0]).toMatchObject({
    minutes: 4,
    on_court: 1,
    seconds: 32,
    three_pointers_attempted: 0,
  })
  expect(converted.home.stats).toMatchObject({
    field_goals_percentage: '-',
    free_throws_percentage: '-',
    three_pointers_percentage: '-',
  })
  expect(converted.visitor.players.player[0]).toMatchObject({
    first_name: 'Nene',
    minutes: 0,
    on_court: 0,
    seconds: 5.5,
  })
})

test('preserves an absent arena as null', () => {
  expect(convertBSProxy(activeBoxScore({ arena: null })).arena).toBeNull()
})

test('normalizes colon-format and zero-second player minutes', () => {
  const boxScore = activeBoxScore()
  boxScore.homeTeam.players[0].statistics.minutes = '04:32'
  boxScore.awayTeam.players[0].statistics.minutes = 'PT00M00.00S'

  const converted = convertBSProxy(boxScore)

  expect(converted.home.players.player[0]).toMatchObject({
    minutes: 4,
    seconds: 32,
  })
  expect(converted.visitor.players.player[0]).toMatchObject({
    minutes: 0,
    seconds: 0,
  })
})

test('normalizes the legacy box-score schema with overtime and missing officials', () => {
  const legacyTeam = (abbreviation, score) => ({
    q1: 20,
    q2: 25,
    q3: 22,
    q4: 24,
    ot1: 8,
    pstsg: [
      {
        ast: 5,
        blk: 1,
        court: 1,
        dreb: 4,
        fga: 10,
        fgm: 5,
        fn: 'Nene',
        fta: 2,
        ftm: 2,
        ln: '',
        min: 24,
        pf: 2,
        pid: '2403',
        pm: 3,
        pos: 'C',
        pts: 12,
        oreb: 3,
        sec: 0,
        stl: 1,
        tpa: 0,
        tpm: 0,
        tov: 2,
      },
    ],
    s: score,
    ta: abbreviation,
    tc: 'Test City',
    tn: 'Test Team',
    tstsg: {
      ast: 20,
      blk: 5,
      dreb: 30,
      fga: 80,
      fgm: 40,
      fta: 20,
      ftm: 15,
      oreb: 10,
      pf: 18,
      stl: 8,
      tf: 1,
      tmreb: 2,
      tmtov: 1,
      tpa: 30,
      tpm: 10,
      tov: 12,
    },
  })
  const boxScore = {
    cl: '00:00',
    hls: legacyTeam('LAL', 99),
    offs: undefined,
    p: 5,
    st: 3,
    stt: 'Final',
    vls: legacyTeam('BOS', 101),
  }

  const converted = convertBS(boxScore)

  expect(converted.officials).toEqual([])
  expect(converted.home.linescores.period).toHaveLength(5)
  expect(converted.home.linescores.period[4]).toMatchObject({ score: '8' })
  expect(converted.home.players.player[0]).toMatchObject({
    first_name: 'Nene',
    on_court: 1,
    person_id: '2403',
  })
  expect(converted.home.stats).toMatchObject({
    field_goals_percentage: '50',
    three_pointers_percentage: '33',
  })
})

test('stores normalized box scores, supplemental team stats, and lead changes', () => {
  const state = reducer(
    undefined,
    fetchLiveGameBox.fulfilled(
      {
        boxScoreData: activeBoxScore(),
        gid: '0022300001',
        pbpData: {
          play: [
            { scoreAway: '0', scoreHome: '0' },
            { scoreAway: '0', scoreHome: '2' },
            { scoreAway: '3', scoreHome: '2' },
            { scoreAway: '3', scoreHome: '4' },
          ],
        },
      },
      'request-id',
      { dateStr: '20240101', gid: '0022300001', isBackground: false }
    )
  )

  expect(state).toMatchObject({
    gid: '0022300001',
    isLoading: false,
    bsData: { home: { nickname: 'Thunder' }, visitor: { nickname: 'Lakers' } },
    teamStats: {
      extra: { leadChanges: 6, timesTied: 4 },
      home: { benchPoints: 18, biggestLead: 12 },
    },
  })
  expect(state.pbpData.play.map((play) => play.changes)).toEqual([
    undefined,
    null,
    true,
    true,
  ])
})

test('keeps the spinner hidden for background requests and resets on rejected requests', () => {
  const backgroundState = reducer(
    undefined,
    fetchLiveGameBox.pending('request-id', {
      dateStr: '20240101',
      gid: '0022300001',
      isBackground: true,
    })
  )
  const loadingState = reducer(
    undefined,
    fetchLiveGameBox.pending('request-id', {
      dateStr: '20240101',
      gid: '0022300001',
      isBackground: false,
    })
  )

  expect(backgroundState.isLoading).toBe(false)
  expect(loadingState.isLoading).toBe(true)
  expect(
    reducer(
      loadingState,
      fetchLiveGameBox.rejected(new Error('failed'), 'request-id', {
        dateStr: '20240101',
        gid: '0022300001',
        isBackground: false,
      })
    )
  ).toEqual({
    bsData: {},
    gid: '',
    isLoading: false,
    pbpData: {},
    teamStats: {},
  })
  expect(reducer(loadingState, resetLiveGameBox())).toEqual({
    bsData: {},
    gid: '',
    isLoading: false,
    pbpData: {},
    teamStats: {},
  })
})

test('rejects malformed box score responses before reducer conversion', async () => {
  const actions = []
  const dispatch = jest.fn((action) => {
    actions.push(action)
    return action
  })
  const originalFetch = global.fetch
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ game: { actions: [] } }),
    })
    .mockResolvedValueOnce({ json: () => Promise.resolve({ game: {} }) })

  await fetchLiveGameBox({
    dateStr: '20240101',
    gid: '0022300001',
    isBackground: false,
  })(dispatch, () => ({}))

  global.fetch = originalFetch
  expect(actions.map((action) => action.type)).toEqual([
    fetchLiveGameBox.pending.type,
    fetchLiveGameBox.rejected.type,
  ])
  expect(reducer(undefined, actions[0]).isLoading).toBe(true)
  expect(reducer(reducer(undefined, actions[0]), actions[1])).toEqual({
    bsData: {},
    gid: '',
    isLoading: false,
    pbpData: {},
    teamStats: {},
  })
})

test('dispatches the request thunk with the resolved background policy', async () => {
  const state = {
    bs: { bsData: {}, gid: '' },
    date: { date: new Date('2024-01-01T12:00:00.000Z') },
    live: {
      games: [{ id: '0022300001' }],
      isLoading: false,
      lastUpdate: new Date(0),
    },
  }
  const actions = []
  const dispatch = jest.fn((action) => {
    if (typeof action === 'function') {
      return action(dispatch, () => state)
    }
    actions.push(action)
    return action
  })
  const originalFetch = global.fetch
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ game: { actions: [] } }),
    })
    .mockResolvedValueOnce({
      json: () => Promise.resolve({ game: activeBoxScore() }),
    })

  await fetchLiveGameBoxIfNeeded(
    '20240101',
    '0022300001',
    false
  )(dispatch, () => state)

  global.fetch = originalFetch
  expect(actions.map((action) => action.type)).toEqual([
    fetchLiveGameBox.pending.type,
    fetchLiveGameBox.fulfilled.type,
  ])
  expect(actions[0].meta.arg).toEqual({
    dateStr: '20240101',
    gid: '0022300001',
    isBackground: false,
  })
})

test('does not request a recently refreshed score for the selected game', async () => {
  const state = {
    bs: { bsData: {}, gid: '0022300001' },
    date: { date: new Date('2024-01-01T12:00:00.000Z') },
    live: {
      games: [{ id: '0022300001' }],
      isLoading: false,
      lastUpdate: new Date(),
    },
  }
  const dispatch = jest.fn()

  await fetchLiveGameBoxIfNeeded('20240101', '0022300001')(
    dispatch,
    () => state
  )

  expect(dispatch).not.toHaveBeenCalled()
})
