import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { store, history } from './store'
import '../styles'
import App from '../containers/Popup/PopUpPage'

createRoot(document.getElementById('app')).render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>
)
