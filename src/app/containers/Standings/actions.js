import types from './types'

export const fetchStandings = () => async (dispatch) => {
  try {
    dispatch({ type: types.REQUEST_START })

    const res = await fetch(
      'https://api.boxscores.site/v1/standings?LeagueID=00&Season=2022-23'
    )
    const teams = await res.json()

    dispatch({
      type: types.REQUEST_SUCCESS,
      payload: teams,
    })
  } catch (error) {
    dispatch({ type: types.REQUEST_ERROR })
  }
}
