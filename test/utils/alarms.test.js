import format from 'date-fns/format'
import { DATE_FORMAT } from '../../src/app/utils/constant'

test('fetches highlights only after the schedule request resolves', async () => {
  let alarmListener
  let resolveGames
  const dispatch = jest.fn()
  const getState = () => ({
    date: { date: new Date('2024-01-01T12:00:00.000Z') },
    bs: { gid: '' },
  })
  const fetchGamesThunk = jest.fn(
    () => () =>
      new Promise((resolve) => {
        resolveGames = resolve
      })
  )
  const fetchHighlightsThunk = jest.fn(() => jest.fn())

  jest.doMock('../../src/app/utils/browser', () => ({
    __esModule: true,
    default: {
      alarms: {
        onAlarm: { addListener: (listener) => (alarmListener = listener) },
      },
    },
  }))
  jest.doMock('../../src/app/store', () => ({ store: { dispatch, getState } }))
  jest.doMock('../../src/app/containers/Popup/actions', () => ({
    fetchGamesIfNeeded: fetchGamesThunk,
    fetchGameHighlightIfNeeded: fetchHighlightsThunk,
  }))
  jest.doMock(
    '../../src/app/containers/BoxScoresDetails/boxScoresDetailsSlice',
    () => ({ fetchLiveGameBoxIfNeeded: jest.fn() })
  )

  jest.isolateModules(() => {
    require('../../src/app/utils/alarms')
  })

  alarmListener({ name: 'minute' })
  expect(fetchGamesThunk).toHaveBeenCalledWith(
    format(getState().date.date, DATE_FORMAT)
  )
  expect(fetchHighlightsThunk).not.toHaveBeenCalled()

  resolveGames()
  await Promise.resolve()

  expect(fetchHighlightsThunk).toHaveBeenCalledWith()
})
