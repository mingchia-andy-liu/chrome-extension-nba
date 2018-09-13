import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { createHashHistory } from 'history'
import reducer, { initialState } from './reducers'

export const history = createHashHistory({
    basname: '',
    hashType: 'slash',
})

const middleware = routerMiddleware(history)
let middlewares
if (process.env.NODE_ENV === 'development') {
    const DevTools = require('./devTools')
    middlewares = compose(
        applyMiddleware(thunk, middleware),
        // Required! Enable Redux DevTools with the monitors you chose
        DevTools.default.instrument()
    )
} else {
    middlewares = compose(applyMiddleware(thunk, middleware))
}

// Create store
export const store = createStore(reducer, initialState, middlewares)
