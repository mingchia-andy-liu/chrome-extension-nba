import { combineReducers } from 'redux'

import liveReducer from './containers/Popup/reducers'
import boxScoresDetailsReducer from './containers/BoxScoresDetails/reducers'
import dateReducer from './containers/DatePicker/dateSlice'
import { apiSlice } from './api/apiSlice'

export const initialState = {}

// combined reducer
export default combineReducers({
  live: liveReducer,
  bs: boxScoresDetailsReducer,
  date: dateReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})
