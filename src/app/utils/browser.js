const noop = () => {}
const browserNameSpace = {}

if (typeof browser !== 'undefined') {
    // Firefox
    browserNameSpace.connect = () => {
        browser.runtime.connect()
    }

    browserNameSpace.getItem = (key, callback) => {
        browser.storage.local.get(key).then((obj) => {
            if (obj[key]) {
                callback(obj[key])
            } else {
                callback(browser.runtime.lastError)
            }
        })
    }

    browserNameSpace.setItem = (key, value, callback) => {
        const obj = { [key]: value }
        browser.storage.local.set(obj).then(() => {
            if (callback && browser.runtime.lastError) {
                callback(key)
            }
        })
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
        if (browser.browserNameSpaceAction.setBadgeText) {
            browser.browserNameSpaceAction.setBadgeText({ text: text })
        }
    }

    browserNameSpace.setBadgeBackgroundColor = (color) => {
        if (browser.browserAction.setBadgeText) {
            browser.browserAction.setBadgeBackgroundColor({ color: color })
        }
    }

    browserNameSpace.tabs = {
        getCurrent: (callback) => {
            browser.tabs.getCurrent().then(() => callback())
        },
    }

} else if (typeof chrome !== 'undefined') {
    // Chrome
    browserNameSpace.connect = () => {
        chrome.runtime.connect()
    }

    browserNameSpace.getItem = (key, callback) => {
        chrome.storage.local.get(key, (obj) => {
            if (obj[key]) {
                callback(obj[key])
            } else {
                callback(chrome.runtime.lastError)
            }
        })
    }

    browserNameSpace.setItem = (key, value, callback) => {
        const obj = { [key]: value }
        chrome.storage.local.set(obj, () => {
            if (callback && chrome.runtime.lastError) {
                callback(key)
            }
        })
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
        if (chrome.browserNameSpaceAction.setBadgeText) {
            chrome.browserNameSpaceAction.setBadgeText({ text: text })
        }
    }


    browserNameSpace.setBadgeBackgroundColor = (color) => {
        if (chrome.browserAction.setBadgeText) {
            chrome.browserAction.setBadgeBackgroundColor({ color: color })
        }
    }

    browserNameSpace.tabs = {
        getCurrent: (callback) => {
            chrome.tabs.getCurrent(() => callback())
        },
    }


} else {
    browserNameSpace.getItem = noop
    browserNameSpace.setItem = noop
    browserNameSpace.removeItem = noop
    browserNameSpace.getAllKeys = noop
    browserNameSpace.setBadgeBackgroundColor = noop
    browserNameSpace.setBadgeText = noop
}

export default browserNameSpace
