import { combineReducers } from 'redux'

import liveReducer from './containers/Popup/liveSlice'
import boxScoresDetailsReducer from './containers/BoxScoresDetails/boxScoresDetailsSlice'
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
