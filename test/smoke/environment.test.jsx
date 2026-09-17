import React from 'react'
import { render, screen } from '@testing-library/react'
import { restoreTime, useUtcTime } from '../support/time'

afterEach(() => {
  restoreTime()
})

test('renders JSX in the jsdom test environment', () => {
  useUtcTime('2024-01-01T00:00:00.000Z')
  render(<main>Test environment ready</main>)

  expect(screen.getByRole('main')).toHaveTextContent('Test environment ready')
  expect(document.documentElement).toBeTruthy()
  expect(window.matchMedia('(prefers-color-scheme: dark)').matches).toBe(false)
  expect(new Date().toISOString()).toBe('2024-01-01T00:00:00.000Z')
})
