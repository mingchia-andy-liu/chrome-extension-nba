import types from './types'

export const fetchStandings = () => async (dispatch) => {
  try {
    dispatch({ type: types.REQUEST_START })

    const res = await fetch(
      'https://stats.nba.com/stats/leaguestandingsv3?GroupBy=conf&LeagueID=00&Season=2022-23&SeasonType=Regular%20Season&Section=overall'
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
