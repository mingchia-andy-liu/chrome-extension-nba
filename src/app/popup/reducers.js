import { combineReducers } from 'redux'

import liveReducer from '../containers/Popup/reducers'
import dateReducer from '../containers/DatePicker/reducers'

export const initialState = {}

// combined reducer
export default combineReducers({
  live: liveReducer,
  date: dateReducer,
})
