import types from './types'

export const fetchStandings = () => async (dispatch) => {
  try {
    dispatch({ type: types.REQUEST_START })

    const res = await fetch(
      'http://data.nba.net/prod/v1/current/standings_all.json'
    )
    const {
      league: {
        standard: { teams },
      },
    } = await res.json()

    dispatch({
      type: types.REQUEST_SUCCESS,
      payload: teams,
    })
  } catch (error) {
    dispatch({ type: types.REQUEST_ERROR })
  }
}
