import {
  allSettled,
  delay,
  formatClock,
  formatGames,
  formatMinutes,
  getDateFromQuery,
  getDoublesText,
  getOddRowColor,
  getYahooFantasyPoints,
  hasDoubles,
  isWinning,
  noop,
  toPercentage,
  waitUntilFinish,
} from '../../src/app/utils/common'

const player = {
  rebounds_defensive: 5,
  rebounds_offensive: 5,
  assists: 10,
  steals: 10,
  blocks: 10,
  points: 10,
}

test.each([
  [{ ...player, assists: 0, steals: 0, blocks: 0 }, 'd', 'Double Doubles'],
  [{ ...player, steals: 0, blocks: 0 }, 't', 'Triple Doubles'],
  [{ ...player, blocks: 0 }, 'q', 'Quadruple Doubles'],
  [player, 'p', 'Quintuple Doubles'],
  [{ ...player, points: 9, assists: 0, steals: 0, blocks: 0 }, '', ''],
])('classifies doubles and labels them', (stats, doubles, label) => {
  expect(hasDoubles(stats)).toBe(doubles)
  expect(getDoublesText(doubles)).toBe(label)
})

test('calculates Yahoo fantasy points and treats missing stats as zero', () => {
  expect(
    getYahooFantasyPoints({
      points: 10,
      rebounds: 5,
      assists: 2,
      steals: 1,
      blocks: 1,
      turnovers: 2,
    })
  ).toBe(23)
  expect(getYahooFantasyPoints({})).toBe(0)
})

test('flattens legacy game fields for score cards', () => {
  expect(
    formatGames([
      {
        lm: { seri: 'LAL leads 2-1' },
        h: { ta: 'LAL', tn: 'Lakers', s: '101' },
        v: { ta: 'BOS', tn: 'Celtics', s: '99' },
      },
    ])
  ).toEqual([
    expect.objectContaining({
      series: 'LAL leads 2-1',
      hta: 'LAL',
      htn: 'Lakers',
      hs: '101',
      vta: 'BOS',
      vtn: 'Celtics',
      vs: '99',
    }),
  ])
})

test.each([
  ['Half', '00:00', 2, 'Halftime'],
  ['Halftime', '00:00', 2, 'Halftime'],
  ['PPD', '', 0, 'Postponed'],
  ['End of 3rd Qtr', '', 3, 'End of Q3'],
  ['Start of 2nd OT', '', 6, 'Start of OT2'],
  ['2 Qtr of', '04:32', 2, 'Q2 04:32'],
  ['1st OT of', '01:00', 5, 'OT1 01:00'],
  ['Final', '', 4, 'Final'],
  ['Final', '', 6, 'Final/OT 2'],
  ['Final OT', '', 5, 'Final OT 1'],
  ['Q2 04:32', '', 2, 'Q2 04:32'],
  ['Scheduled', '07:30 PM', 0, 'Scheduled'],
  ['Unknown', '04:32', 2, '04:32'],
])('formats clock status %s', (status, clock, period, expected) => {
  expect(formatClock(clock, status, period)).toBe(expected)
})

test('formats display helpers and query dates', () => {
  expect(formatMinutes({ minutes: 4, seconds: 9 })).toBe('04:09')
  expect(formatMinutes({ minutes: '12', seconds: '00' })).toBe('12:00')
  expect(toPercentage(0.456)).toBe('46')
  expect(toPercentage(Number.NaN)).toBe('-')
  expect(isWinning('101', '99')).toBe(true)
  expect(isWinning('99', '101')).toBe(false)
  expect(isWinning('', '')).toBe(true)
  expect(getOddRowColor(1, false)).toBe('hsl(0, 0%, 95%)')
  expect(getOddRowColor(1, true)).toBe('hsl(0, 0%, 25%)')
  expect(getOddRowColor(2, true)).toBeUndefined()
  expect(noop()).toBeUndefined()
  expect(getDateFromQuery({ search: '?date=20240101' })).toBe('20240101')
  expect(getDateFromQuery({ search: '' })).toBeUndefined()
})

test('resolves delays and waits until the expected value is available', async () => {
  jest.useFakeTimers()
  const getValue = jest
    .fn()
    .mockReturnValueOnce('loading')
    .mockReturnValue('ready')
  const waiting = waitUntilFinish(getValue, 'ready', 100, 3)

  await jest.runAllTimersAsync()
  await waiting

  const delayed = delay(50)
  await jest.advanceTimersByTimeAsync(50)
  await expect(delayed).resolves.toBeUndefined()
  jest.useRealTimers()
})

test('settles fulfilled and rejected promises', async () => {
  await expect(
    allSettled([Promise.resolve('score'), Promise.reject(new Error('offline'))])
  ).resolves.toEqual([
    { status: 'fullfilled', value: 'score' },
    { status: 'rejected', reason: expect.any(Error) },
  ])
})
