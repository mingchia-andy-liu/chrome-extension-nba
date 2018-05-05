const noop = () => {}
const browser = {}

if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    browser.connect = () => {
        chrome.runtime.connect()
    }

    browser.getItem = (key, callback) => {
        chrome.storage.local.get(key, (obj) => {
            if (obj[key]) {
                callback(obj[key])
            } else {
                callback(chrome.runtime.lastError)
            }
        })
    }

    browser.setItem = (key, value, callback) => {
        const obj = { [key]: value }
        chrome.storage.local.set(obj, () => {
            if (callback && chrome.runtime.lastError) {
                callback(key)
            }
        })
    }

    browser.removeItem = (key) => {
        chrome.storage.local.remove(key)
    }

    browser.getAll = (callback) => {
        chrome.storage.local.get(null, (obj) => callback(obj))
    }

    browser.getAllKeys = (callback) => {
        chrome.storage.local.get(null, (obj) => callback(Object.keys(obj)))
    }

    browser.setBadgeText = (text) => {
        if (chrome.browserAction.setBadgeText) {
            chrome.browserAction.setBadgeText({ text: text })
        }
    }


    browser.setBadgeBackgroundColor = (color) => {
        if (chrome.browserAction.setBadgeText) {
            chrome.browserAction.setBadgeBackgroundColor({ color: color })
        }
    }

    browser.tabs = {
        getCurrent: (callback) => {
            chrome.tabs.getCurrent(() => callback())
        },
    }


} else {
    browser.getItem = noop
    browser.setItem = noop
    browser.removeItem = noop
    browser.getAllKeys = noop
    browser.setBadgeBackgroundColor = noop
    browser.setBadgeText = noop
}

export default browser
