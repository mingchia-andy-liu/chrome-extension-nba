import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { store, history } from './store'
import './styles'
import App from './containers/App'
import browser from './utils/browser'
import './utils/alarms'

// Create a connection with the background script to handle open and close events.
browser.runtime.connect()

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
    , document.getElementById('app')
)

import showDevTools from './showDevTools'
showDevTools(store)
