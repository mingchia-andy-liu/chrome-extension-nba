import { createBrowserMock } from '../support/browser'

test('installs a resettable Chrome callback API mock', () => {
  const mock = createBrowserMock({ spoiler: true })

  mock.installChrome()
  jest.resetModules()

  const browser = require('../../src/app/utils/browser').default
  browser.getItem('spoiler', (value) => {
    expect(value).toEqual({ spoiler: true })
  })

  browser.setItem({ spoiler: false })
  expect(mock.getStorage()).toEqual({ spoiler: false })

  mock.reset()
  expect(mock.getStorage()).toEqual({ spoiler: true })

  mock.restoreGlobals()
  jest.resetModules()
})

test('marks a live game from the game-card fallback feed', () => {
  const mock = createBrowserMock()
  mock.installChrome()
  jest.resetModules()

  const { checkLiveGame } = require('../../src/app/utils/browser')
  checkLiveGame([{ cardData: { gameStatus: 2 } }], 5)

  expect(mock.browser.action.setBadgeText).toHaveBeenCalledWith({
    text: 'LIVE',
  })
  mock.restoreGlobals()
  jest.resetModules()
})
