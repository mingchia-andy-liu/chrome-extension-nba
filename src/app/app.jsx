import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { store, history } from './store'
import './styles'
import App from './containers/App'
import browser from './utils/browser'
import './utils/alarms'

import fetch from 'node-fetch'

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

// import showDevTools from './showDevTools'
// showDevTools(store)


document.querySelector('#my-button').addEventListener('click', function(event) {
    // Permissions must be requested from inside a user gesture, like a button's
    // click handler.
    chrome.permissions.request({
        permissions: ['tabs'],
        origins: ['https://reqres.in/'],
    }, function(granted) {
    // The callback argument will be true if the user granted the permissions.
        if (granted) {
            console.log('granted')

            const res = fetch('https://reqres.in/api/users')
            const users = res.json()
            console.log(res)
            console.log(users)
        } else {
            console.log('no granted')
        }
    });
});
