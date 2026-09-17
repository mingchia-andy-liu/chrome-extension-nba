import '@testing-library/jest-dom'

process.env.TZ = 'UTC'

const dateTimeFormat = Intl.DateTimeFormat
jest.spyOn(Intl, 'DateTimeFormat').mockImplementation((...args) => {
  const formatter = new dateTimeFormat(...args)

  if (args.length > 0) {
    return formatter
  }

  return {
    resolvedOptions: () => ({
      ...formatter.resolvedOptions(),
      timeZone: 'UTC',
    }),
  }
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
})
