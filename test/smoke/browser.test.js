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
