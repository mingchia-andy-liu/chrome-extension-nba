export const origin = process.env.ORIGIN

export const proxyUrl = (apiUrl) => `${origin}?apiUrl=${apiUrl}`
