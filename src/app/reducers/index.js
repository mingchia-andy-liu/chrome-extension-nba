import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import liveReducer from './liveReducer'

export const initialState = {}

// define app-level reducer
const appReducer = combineReducers({
})

// combined reducer
export default combineReducers({
    // app: appReducer,
    live: liveReducer,
})
