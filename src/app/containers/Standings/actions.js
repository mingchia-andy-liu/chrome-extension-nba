import types from './types'

export const fetchStandings = () => async (dispatch) => {
  try {
    dispatch({ type: types.REQUEST_START })

    let data = []
    let isProxy = true
    try {
      const res = await fetch(
        'https://api.boxscores.site/v1/standings?LeagueID=00&Season=2022-23'
      )
      const teams = await res.json()
      data = teams
    } catch (error) {
      const res = await fetch(
        'https://proxy.boxscores.site?apiUrl=stats.nba.com/stats/leaguestandingsv3&GroupBy=conf&LeagueID=00&Season=2022-23&SeasonType=Regular%20Season&Section=overall'
      )
      const { resultSets } = await res.json()
      const teams = resultSets[0]?.rowSet ?? []
      data = teams
      isProxy = false
    }

    dispatch({
      type: types.REQUEST_SUCCESS,
      payload: {
        data,
        isProxy,
      },
    })
  } catch (error) {
    dispatch({ type: types.REQUEST_ERROR })
  }
}
