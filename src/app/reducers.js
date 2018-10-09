import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import liveReducer from './containers/Popup/reducers'
import boxScoresReducer from './containers/BoxScores/reducers'
import dateReducer from './containers/DatePicker/reducers'
import standingsReducer from './containers/Standings/reducers'
import playoffReducer from './containers/Playoffs/reducers'

export const initialState = {}


// combined reducer
export default combineReducers({
    routing,
    live: liveReducer,
    bs: boxScoresReducer,
    date: dateReducer,
    standings: standingsReducer,
    playoff: playoffReducer,
})
