import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer, { initialState } from './reducers'

// Create store
export const store = createStore(reducer, initialState, applyMiddleware(thunk))
