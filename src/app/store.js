import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
import reducer, { initialState } from './reducers'

export const history = createBrowserHistory()

const middleware = routerMiddleware(history)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// Create store and allow for redux devtools to hook onto it
export const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, middleware))
)
