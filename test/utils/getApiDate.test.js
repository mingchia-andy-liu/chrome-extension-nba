import getApiDate from '../../src/app/utils/getApiDate'
import { advanceTo, clear } from 'jest-date-mock'

test('should be correct date', () => {
  advanceTo('2020-01-01T11:00:01.000Z')
  const oldDate = getApiDate()
  expect(oldDate).toBeInstanceOf(Date)
  clear()
})
