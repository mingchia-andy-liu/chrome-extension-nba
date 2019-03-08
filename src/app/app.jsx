import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { store, history } from './store'
import './styles'
import App from './containers/App'
import './utils/alarms'

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
    , document.getElementById('app')
)

if (process.env.NODE_ENV === 'development') {
    const showDevTools = require('./showDevTools')
    showDevTools.default(store)
}
