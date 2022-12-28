const noop = () => {}
const browserNameSpace = {}

if (typeof browser !== 'undefined') {
  // Firefox
  browserNameSpace.isFirefox = true
  browserNameSpace.runtime = {
    connect: () => {
      browser.runtime.connect()
    },
    onInstalled: {
      addListener: (callback) => {
        browser.runtime.onInstalled.addListener(callback)
      },
    },
    onUpdateAvailable: {
      addListener: (callback) => {
        browser.runtime.onUpdateAvailable.addListener(callback)
      },
    },
    reload: () => {
      browser.runtime.reload()
    },
    getManifest: () => {
      return browser.runtime.getManifest()
    },
  }

  browserNameSpace.getItem = (key, callback) => {
    browser.storage.local.get(key).then((obj) => {
      if (obj) {
        callback(obj)
      } else {
        callback(browser.runtime.lastError)
      }
    })
  }

  browserNameSpace.clear = (callback) => {
    browser.storage.local.clear(callback)
  }

  browserNameSpace.setItem = (obj) => {
    browser.storage.local.set(obj)
  }

  browserNameSpace.removeItem = (key) => {
    browser.storage.local.remove(key)
  }

  browserNameSpace.getAll = (callback) => {
    browser.storage.local.get(null).then((obj) => callback(obj))
  }

  browserNameSpace.getAllKeys = (callback) => {
    browser.storage.local.get(null).then((obj) => callback(Object.keys(obj)))
  }

  browserNameSpace.setBadgeText = (text) => {
    if (browser.browserAction.setBadgeText) {
      browser.browserAction.setBadgeText(text)
    }
  }

  browserNameSpace.setBadgeBackgroundColor = (color) => {
    if (browser.browserAction.setBadgeText) {
      browser.browserAction.setBadgeBackgroundColor(color)
    }
  }

  browserNameSpace.tabs = {
    create: (options) => {
      browser.tabs.create(options)
    },
    getCurrent: (callback) => {
      browser.tabs.getCurrent().then((tab) => callback(tab))
    },
  }

  browserNameSpace.alarms = {
    create: (name, options) => browser.alarms.create(name, options),

    onAlarm: {
      addListener: (listener) => browser.alarms.onAlarm.addListener(listener),
    },
  }

  browserNameSpace.permissions = {
    contains: (permissions, callback) => {
      browser.permissions
        .contains(permissions)
        .then((result) => callback(result))
    },
    request: (permissions, callback) => {
      browser.permissions
        .request(permissions)
        .then((result) => callback(result))
    },
    remove: (permissions, callback) => {
      browser.permissions.remove(permissions).then((result) => callback(result))
    },
  }

  browserNameSpace.notifications = {
    create: (id, options) => {
      if (browser.notifications && browser.notifications.create) {
        browser.notifications.create(id, options)
      }
    },
    clear: (id) => {
      if (browser.notifications && browser.notifications.clear) {
        browser.notifications.clear(id)
      }
    },
    getAll: (cb) => {
      if (browser.notifications && browser.notifications.getAll) {
        return browser.notifications.getAll().then(cb)
      }
    },
    onClicked: {
      addListener: (fn) => {
        if (
          browser.notifications &&
          browser.notifications.onClicked &&
          browser.notifications.onClicked.addListener
        ) {
          browser.notifications.onClicked.addListener(fn)
        }
      },
      hasListener: (fn) => {
        if (
          browser.notifications &&
          browser.notifications.onClicked &&
          browser.notifications.onClicked.hasListener
        ) {
          return browser.notifications.onClicked.hasListener(fn)
        }
      },
    },
  }
} else if (typeof chrome !== 'undefined' && chrome.runtime !== undefined) {
  // Chrome
  browserNameSpace.isChrome = true
  browserNameSpace.runtime = {
    connect: () => {
      chrome.runtime.connect()
    },
    onInstalled: {
      addListener: (callback) => {
        chrome.runtime.onInstalled.addListener(callback)
      },
    },
    onUpdateAvailable: {
      addListener: (callback) => {
        chrome.runtime.onUpdateAvailable.addListener(callback)
      },
    },
    reload: () => {
      chrome.runtime.reload()
    },
    getManifest: () => {
      return chrome.runtime.getManifest()
    },
  }

  browserNameSpace.getItem = (key, callback) => {
    chrome.storage.local.get(key, (obj) => {
      if (obj) {
        callback(obj)
      } else {
        callback(chrome.runtime.lastError)
      }
    })
  }

  browserNameSpace.clear = (callback) => {
    chrome.storage.local.clear(callback)
  }

  browserNameSpace.setItem = (obj) => {
    chrome.storage.local.set(obj)
  }

  browserNameSpace.removeItem = (key) => {
    chrome.storage.local.remove(key)
  }

  browserNameSpace.getAll = (callback) => {
    chrome.storage.local.get(null, (obj) => callback(obj))
  }

  browserNameSpace.getAllKeys = (callback) => {
    chrome.storage.local.get(null, (obj) => callback(Object.keys(obj)))
  }

  // https://developer.chrome.com/docs/extensions/reference/action/
  browserNameSpace.setBadgeText = (text) => {
    if (chrome.action.setBadgeText) {
      chrome.action.setBadgeText(text)
    }
  }

  // https://developer.chrome.com/docs/extensions/reference/action/#method-setBadgeText
  browserNameSpace.setBadgeBackgroundColor = (color) => {
    if (chrome.action.setBadgeText) {
      chrome.action.setBadgeBackgroundColor(color)
    }
  }

  browserNameSpace.tabs = {
    create: (options) => {
      chrome.tabs.create(options)
    },
    getCurrent: (callback) => {
      chrome.tabs.getCurrent((tab) => callback(tab))
    },
  }

  browserNameSpace.alarms = {
    create: (name, options) => chrome.alarms.create(name, options),

    onAlarm: {
      addListener: (listener) => chrome.alarms.onAlarm.addListener(listener),
    },
  }

  browserNameSpace.permissions = {
    contains: (permissions, callback) => {
      chrome.permissions.contains(permissions, callback)
    },
    request: (permissions, callback) => {
      chrome.permissions.request(permissions, callback)
    },
    remove: (permissions, callback) => {
      chrome.permissions.remove(permissions, callback)
    },
  }

  browserNameSpace.notifications = {
    create: (id, options) => {
      if (chrome.notifications && chrome.notifications.create) {
        chrome.notifications.create(id, options)
      }
    },
    clear: (id) => {
      if (chrome.notifications && chrome.notifications.clear) {
        chrome.notifications.clear(id)
      }
    },
    getAll: (cb) => {
      if (chrome.notifications && chrome.notifications.getAll) {
        return chrome.notifications.getAll(cb)
      }
    },
    onClicked: {
      addListener: (fn) => {
        if (
          chrome.notifications &&
          chrome.notifications.onClicked &&
          chrome.notifications.onClicked.addListener
        ) {
          chrome.notifications.onClicked.addListener(fn)
        }
      },
      hasListener: (fn) => {
        if (
          chrome.notifications &&
          chrome.notifications.onClicked &&
          chrome.notifications.onClicked.hasListener
        ) {
          return chrome.notifications.onClicked.hasListener(fn)
        }
      },
    },
  }
} else {
  browserNameSpace.isFirefox = false
  browserNameSpace.isChrome = false
  browserNameSpace.alarms = {
    create: noop,
    onAlarm: { addListener: noop },
  }
  browserNameSpace.clear = noop
  browserNameSpace.getAllKeys = noop
  browserNameSpace.getItem = noop
  browserNameSpace.removeItem = noop
  browserNameSpace.setBadgeBackgroundColor = noop
  browserNameSpace.setBadgeText = noop
  browserNameSpace.setItem = noop
  browserNameSpace.tabs = { getCurrent: noop }
  browserNameSpace.notifications = {
    create: noop,
    clear: noop,
    getAll: noop,
    onClicked: { addListener: noop, hasListener: noop },
  }
}

export const checkLiveGame = (games, isFallBack = 0) => {
  let hasLiveGame
  if (isFallBack === 1) {
    hasLiveGame = games.find((game) => game.st === 2)
  } else if (isFallBack === 2) {
    hasLiveGame = games.find((game) => game.statusNum === 2)
  } else if (isFallBack === 3) {
    hasLiveGame = games.find((game) => game.gameStatus === 2)
  } else {
    hasLiveGame = games.find(
      (game) => game && game.period_time && game.period_time.game_status === '2'
    )
  }
  if (hasLiveGame) {
    browserNameSpace.setBadgeText({ text: 'LIVE' })
    browserNameSpace.setBadgeBackgroundColor({ color: '#FC0D1B' })
  } else {
    browserNameSpace.setBadgeText({ text: '' })
  }
}

export default browserNameSpace
