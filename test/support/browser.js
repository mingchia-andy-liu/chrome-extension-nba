export const createBrowserMock = (seed = {}) => {
  const initialStorage = { ...seed }
  let storage = { ...initialStorage }
  const tabs = []
  const alarms = []
  const notifications = []
  const permissions = new Set()

  const browser = {
    storage: {
      local: {
        clear: (callback) => {
          storage = {}
          callback?.()
        },
        get: (key, callback) => {
          const result = key === null ? { ...storage } : { [key]: storage[key] }
          callback(result)
        },
        set: (values, callback) => {
          storage = { ...storage, ...values }
          callback?.()
        },
        remove: (key, callback) => {
          delete storage[key]
          callback?.()
        },
      },
    },
    runtime: {
      lastError: null,
      connect: jest.fn(),
      getManifest: jest.fn(() => ({})),
      reload: jest.fn(),
      onInstalled: { addListener: jest.fn() },
      onUpdateAvailable: { addListener: jest.fn() },
    },
    tabs: {
      create: jest.fn((options) => tabs.push(options)),
      getCurrent: jest.fn((callback) => callback(tabs[0])),
    },
    alarms: {
      create: jest.fn((name, options) => alarms.push({ name, options })),
      onAlarm: { addListener: jest.fn() },
    },
    notifications: {
      create: jest.fn((id, options) => notifications.push({ id, options })),
      clear: jest.fn(),
      getAll: jest.fn((callback) => callback({})),
      onClicked: { addListener: jest.fn(), hasListener: jest.fn() },
    },
    permissions: {
      contains: jest.fn((requested, callback) =>
        callback(
          (requested.permissions || []).every((permission) =>
            permissions.has(permission)
          )
        )
      ),
      request: jest.fn((requested, callback) => {
        const requestedPermissions = requested.permissions || []
        requestedPermissions.forEach((permission) =>
          permissions.add(permission)
        )
        callback(true)
      }),
      remove: jest.fn((requested, callback) => {
        const requestedPermissions = requested.permissions || []
        requestedPermissions.forEach((permission) =>
          permissions.delete(permission)
        )
        callback(true)
      }),
    },
    action: {
      setBadgeText: jest.fn(),
      setBadgeBackgroundColor: jest.fn(),
    },
  }

  const originalChrome = globalThis.chrome
  const originalBrowser = globalThis.browser

  const reset = () => {
    storage = { ...initialStorage }
    tabs.length = 0
    alarms.length = 0
    notifications.length = 0
    permissions.clear()
  }

  return {
    browser,
    installChrome: () => {
      globalThis.chrome = browser
      globalThis.browser = undefined
    },
    restoreGlobals: () => {
      globalThis.chrome = originalChrome
      globalThis.browser = originalBrowser
    },
    reset,
    getStorage: () => ({ ...storage }),
    tabs,
    alarms,
    notifications,
  }
}
