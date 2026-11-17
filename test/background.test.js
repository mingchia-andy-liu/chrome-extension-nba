describe('background scoreboard polling', () => {
  let alarmListener
  let fetchFromOrigin
  let startupListener

  beforeEach(() => {
    jest.resetModules()
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T12:30:00.000Z'))
    fetchFromOrigin = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ scoreboard: { games: [] } }),
      })
    )

    jest.doMock('../src/app/utils/browser', () => ({
      __esModule: true,
      checkLiveGame: jest.fn(),
      default: {
        alarms: {
          create: jest.fn(),
          onAlarm: { addListener: (listener) => (alarmListener = listener) },
        },
        permissions: { contains: (_, callback) => callback(false) },
        notifications: { clear: jest.fn(), onClicked: {} },
        runtime: {
          onInstalled: { addListener: jest.fn() },
          onStartup: { addListener: (listener) => (startupListener = listener) },
          onUpdateAvailable: { addListener: jest.fn() },
          getManifest: jest.fn(),
          reload: jest.fn(),
        },
        tabs: { create: jest.fn() },
      },
    }))
    jest.doMock('../src/app/utils/getApiDate', () => ({
      __esModule: true,
      default: jest.fn(),
      isOffseason: jest.fn(() => false),
    }))
    jest.doMock('../src/app/utils/origin', () => ({
      fetchFromOrigin,
      proxyUrl: jest.fn((url) => url),
    }))

    require('../src/app/background')
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('polls only at the half-hour alarm slots', () => {
    jest.setSystemTime(new Date('2024-01-01T12:29:00.000Z'))
    alarmListener({
      name: 'minute',
      scheduledTime: new Date('2024-01-01T12:29:00.000Z').valueOf(),
    })
    expect(fetchFromOrigin).not.toHaveBeenCalled()

    jest.setSystemTime(new Date('2024-01-01T12:30:00.000Z'))
    alarmListener({
      name: 'minute',
      scheduledTime: new Date('2024-01-01T12:30:00.000Z').valueOf(),
    })
    expect(fetchFromOrigin).toHaveBeenCalledTimes(1)
  })

  test('refreshes the badge when the browser starts', () => {
    startupListener()

    expect(fetchFromOrigin).toHaveBeenCalledTimes(1)
  })
})
