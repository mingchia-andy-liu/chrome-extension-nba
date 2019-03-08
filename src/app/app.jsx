import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { getStore, history } from './store'
import './styles'
import App from './containers/App'
import './utils/alarms'

console.time('start')
const init = async() => {
    const store = await getStore()
    console.timeEnd('start')
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>
        , document.getElementById('app')
    )

    // if (process.env.NODE_ENV === 'development') {
    //     const showDevTools = require('./showDevTools')
    //     showDevTools.default(store)
    // }
}
init()
