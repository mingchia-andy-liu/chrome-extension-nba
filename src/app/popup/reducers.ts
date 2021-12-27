import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import liveReducer from '../containers/Popup/reducers'
import dateReducer from '../containers/DatePicker/reducers'

export const initialState = {}

// combined reducer
export default combineReducers({
  routing,
  live: liveReducer,
  date: dateReducer,
})
