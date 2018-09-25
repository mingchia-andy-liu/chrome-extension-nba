const noop = () => {}
const browserNameSpace = {}

if (typeof browser !== 'undefined') {
    // Firefox
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
            browser.tabs.getCurrent().then(() => callback())
        },
    }

    browserNameSpace.alarms = {
        create: (name, options) => (
            browser.alarms.create(name, options)
        ),

        onAlarm: {
            addListener: (listener) => (
                browser.alarms.onAlarm.addListener(listener)
            ),
        },
    }
} else if (typeof chrome !== 'undefined') {
    // Chrome
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

    browserNameSpace.setBadgeText = (text) => {
        if (chrome.browserAction.setBadgeText) {
            chrome.browserAction.setBadgeText(text)
        }
    }

    browserNameSpace.setBadgeBackgroundColor = (color) => {
        if (chrome.browserAction.setBadgeText) {
            chrome.browserAction.setBadgeBackgroundColor(color)
        }
    }

    browserNameSpace.tabs = {
        create: (options) => {
            chrome.tabs.create(options)
        },
        getCurrent: (callback) => {
            chrome.tabs.getCurrent(() => callback())
        },
    }

    browserNameSpace.alarms = {
        create: (name, options) => (
            chrome.alarms.create(name, options)
        ),

        onAlarm: {
            addListener: (listener) => (
                chrome.alarms.onAlarm.addListener(listener)
            ),
        },
    }

} else {
    browserNameSpace.alarms.create = noop
    browserNameSpace.alarms.onAlarm.addListener = noop
    browserNameSpace.clear = noop
    browserNameSpace.getAllKeys = noop
    browserNameSpace.getItem = noop
    browserNameSpace.removeItem = noop
    browserNameSpace.setBadgeBackgroundColor = noop
    browserNameSpace.setBadgeText = noop
    browserNameSpace.setItem = noop
}

export default browserNameSpace
