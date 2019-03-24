import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import liveReducer from './containers/Popup/reducers'
import boxScoresDetailsReducer from './containers/BoxScoresDetails/reducers'
import dateReducer from './containers/DatePicker/reducers'
import standingsReducer from './containers/Standings/reducers'
import playoffReducer from './containers/Playoffs/reducers'

export const initialState = {}


// combined reducer
export default combineReducers({
    routing,
    live: liveReducer,
    bs: boxScoresDetailsReducer,
    date: dateReducer,
    standings: standingsReducer,
    playoff: playoffReducer,
})
