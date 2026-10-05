import getApiDate from '../../src/app/utils/getApiDate'

test('should be correct date', () => {
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01T11:00:01.000Z'))
  try {
    const oldDate = getApiDate()
    expect(oldDate).toBeInstanceOf(Date)
  } finally {
    jest.useRealTimers()
  }
})
