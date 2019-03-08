import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { createHashHistory } from 'history'
import reducer from './reducers'
import throttle from 'lodash.throttle'
import { loadState, saveState } from './utils/browser'
import { isEmpty } from './utils/common'

export const history = createHashHistory({
    basname: '',
    hashType: 'slash',
})

const middleware = routerMiddleware(history)
let middlewares
if (process.env.NODE_ENV === 'development') {
    const DevTools = require('./devTools')
    middlewares = compose(
        applyMiddleware(thunk, middleware),
        // Required! Enable Redux DevTools with the monitors you chose
        DevTools.default.instrument()
    )
} else {
    middlewares = compose(applyMiddleware(thunk, middleware))
}


const mergeWithPersistedState = (persistedState) => {
    if (isEmpty(persistedState)) {
        return {}
    }

    return {
        live: {
            games: persistedState.games,
            isLoading: false,
            lastUpdate: persistedState.lastUpdate,
        },
    }
}

// Create store
let store = null
export const getStore = () => {
    return new Promise((res) => {
        if (store != null) {
            return res(store)
        }
        loadState().then((persistedState) => {
            const initialState = mergeWithPersistedState(persistedState)
            store = createStore(reducer, initialState, middlewares)

            store.subscribe(throttle(() => {
                const state = store.getState()
                if (isEmpty(state) || isEmpty(state.live) || state.live.isLoading) {
                    return
                }
                saveState({
                    games: state.live.games,
                    lastUpdate: state.live.lastUpdate,
                })
            }), 3000)

            return res(store)
        })
    })
}
