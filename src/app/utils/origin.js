export const origin = process.env.ORIGIN

export const extensionId =
  typeof chrome !== 'undefined'
    ? chrome.runtime.id
    : typeof browser !== 'undefined'
      ? browser.runtime.id
      : ''

export const proxyUrl = (apiUrl) => `${origin}?apiUrl=${apiUrl}`

export const fetchFromOrigin = (url, options = {}) => {
  const headers = new Headers(options.headers)
  if (extensionId) {
    headers.set('X-Client-Id', extensionId)
  }
  return fetch(url, { ...options, headers })
}
