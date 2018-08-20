import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { createHashHistory } from 'history'
import reducer, { initialState } from './reducers'

import DevTools from './devTools'

export const history = createHashHistory({
    basname: '',
    hashType: 'slash',
})

const middleware = routerMiddleware(history)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// Create store and allow for redux devtools to hook onto it
export const store = createStore(
    reducer,
    initialState,
    composeEnhancers(
        applyMiddleware(thunk, middleware),
        // Required! Enable Redux DevTools with the monitors you chose
        DevTools.instrument()
    )
)
