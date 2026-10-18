import { store as appStore } from '../../src/app/store'
import { store as popupStore } from '../../src/app/popup/store'

test.each([
  ['full-page', appStore],
  ['popup', popupStore],
])('%s store supports thunk dispatch', (name, store) => {
  const thunk = jest.fn((dispatch, getState) => {
    expect(typeof dispatch).toBe('function')
    expect(getState()).toEqual(expect.any(Object))
    return name
  })

  expect(store.dispatch(thunk)).toBe(name)
  expect(thunk).toHaveBeenCalledTimes(1)
})
