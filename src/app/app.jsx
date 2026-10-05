import './utils/wdyr'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { store } from './store'
import './styles'
import App from './containers/App'
import './utils/alarms'

createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
)

if (process.env.NODE_ENV === 'development') {
  window.Store = store
}
