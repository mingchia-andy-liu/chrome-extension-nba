export const useUtcTime = (time) => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date(time))
}

export const restoreTime = () => {
  jest.useRealTimers()
}
