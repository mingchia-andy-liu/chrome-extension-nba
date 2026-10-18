export const proxyOrigin = process.env.PROXY_ORIGIN

export const proxyUrl = (apiUrl) => `${proxyOrigin}?apiUrl=${apiUrl}`
