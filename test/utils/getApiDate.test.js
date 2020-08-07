import getApiDate, { newApiDate } from '../../src/app/utils/getApiDate'
import { advanceTo, clear } from 'jest-date-mock'

test.each([
  ['2020-01-01T00:00:00Z', '2019-12-31T20:00:00Z'],
  // ['2019-12-31T23:59:59Z', '2019-12-31T20:00:00Z'],
  // ['2020-02-29T00:00:00Z', '2020-02-28T20:00:00Z'],
  // // 5:59 am est
  // ['2020-01-01T09:59:59Z', '2020-01-01T10:00:00Z'],
  // ['2020-01-01T10:00:00Z', '2020-01-01T10:00:00Z'],
])('should be the same', (date, expected) => {
  console.log('iso', new Date().toISOString())
  advanceTo(date)
  const oldDate = getApiDate()
  const newDate = newApiDate()
  console.log(new Date().toISOString(), date, oldDate.toISOString(), newDate.toISOString(), expected)
  expect(oldDate).toBeInstanceOf(Date)
  expect(newDate).toBeInstanceOf(Date)
  expect(oldDate).toEqual(newDate)
  expect(oldDate).toEqual(new Date(expected))
  expect(newDate).toEqual(new Date(expected))
  clear()
})
