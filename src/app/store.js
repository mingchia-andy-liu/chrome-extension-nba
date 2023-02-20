import { applyMiddleware, compose } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
// import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { createHashHistory } from 'history'
import reducer, { initialState } from './reducers'

export const history = createHashHistory({
  basname: '',
  hashType: 'slash',
})

const middleware = routerMiddleware(history)
// const middlewares = compose(applyMiddleware(thunk, middleware))

// Create store
export const store = configureStore({
  reducer,
  // middleware: middlewares
})
