import React from 'react'
import { Provider } from 'react-redux'
import { fireEvent, render, screen } from '@testing-library/react'
import dateReducer, {
  changeDate,
} from '../../src/app/containers/DatePicker/dateSlice'
import DatePicker from '../../src/app/containers/DatePicker'
import { createAppStore } from '../support/stores'

jest.mock('react-flatpickr', () => ({ onChange }) => (
  <button onClick={() => onChange([new Date('2024-01-16T12:00:00.000Z')])}>
    Select date
  </button>
))

jest.mock('../../src/app/components/Context', () => ({
  ThemeConsumer: ({ children }) => children({ state: { dark: false } }),
}))

const renderDatePicker = (date, onChange = jest.fn(), bs) => {
  const store = createAppStore({ date: { date }, ...(bs && { bs }) })
  const view = render(
    <Provider store={store}>
      <DatePicker onChange={onChange} />
    </Provider>
  )

  return { ...view, onChange, store }
}

test('changes the selected date while preserving the date state shape', () => {
  const date = new Date('2024-01-15T12:00:00.000Z')

  expect(dateReducer(undefined, changeDate(date))).toEqual({ date })
})

test('arrow navigation updates the selected date, notifies the caller, and resets box scores', () => {
  const date = new Date('2024-01-15T12:00:00.000Z')
  const bs = {
    bsData: { home: {} },
    gid: '123',
    isLoading: true,
    pbpData: { play: [] },
    teamStats: { home: {} },
  }
  const { container, onChange, store } = renderDatePicker(date, jest.fn(), bs)

  fireEvent.click(container.querySelectorAll('img')[1])

  expect(store.getState().date.date).toEqual(
    new Date('2024-01-16T12:00:00.000Z')
  )
  expect(onChange).toHaveBeenCalledWith('20240116')
  expect(store.getState().bs).toEqual({
    bsData: {},
    gid: '',
    isLoading: false,
    pbpData: {},
    teamStats: {},
  })
})

test('calendar selection updates the selected date and notifies the caller with the date', () => {
  const { onChange, store } = renderDatePicker(
    new Date('2024-01-15T12:00:00.000Z')
  )

  fireEvent.click(screen.getByRole('button', { name: 'Select date' }))

  expect(store.getState().date.date).toEqual(
    new Date('2024-01-16T12:00:00.000Z')
  )
  expect(onChange).toHaveBeenCalledWith(new Date('2024-01-16T12:00:00.000Z'))
})

test('arrow navigation ignores dates outside the supported range', () => {
  const maxDate = new Date('2099-01-01T00:00:00.000Z')
  const { container, onChange, store } = renderDatePicker(maxDate)

  fireEvent.click(container.querySelectorAll('img')[1])

  expect(store.getState().date.date).toEqual(maxDate)
  expect(onChange).not.toHaveBeenCalled()
})
