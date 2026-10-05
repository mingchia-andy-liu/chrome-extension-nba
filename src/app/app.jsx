import './utils/wdyr'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { store, history } from './store'
import './styles'
import App from './containers/App'
import './utils/alarms'

createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
)

if (process.env.NODE_ENV === 'development') {
  window.Store = store
}
