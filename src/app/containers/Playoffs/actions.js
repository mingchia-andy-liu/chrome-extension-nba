import types from './types'

export const fetchPlayoff2 = async (dispatch) => {
  try {
    dispatch({ type: types.REQUEST_START })

    const res = await fetch(
      'https://stats.nba.com/stats/playoffbracket?LeagueID=00&SeasonYear=2020&State=2'
    )
    const {
      bracket: { playoffBracketSeries },
    } = await res.json()

    dispatch({
      type: types.REQUEST_SUCCESS,
      payload: {
        version: 1,
        series: playoffBracketSeries || [],
      },
    })
  } catch (error) {
    dispatch({ type: types.REQUEST_ERROR })
  }
}

export const fetchPlayoff = () => async (dispatch) => {
  // try {
  //   dispatch({ type: types.REQUEST_START })
  //   const res = await fetch(
  //     'https://data.nba.net/prod/v1/2019/playoffsBracket.json'
  //   )
  //   const { series } = await res.json()

  //   dispatch({
  //     type: types.REQUEST_SUCCESS,
  //     payload: {
  //       version: 0,
  //       series: series || [],
  //     }
  //   })
  // } catch (error) {
  return fetchPlayoff2(dispatch)
  // }
}
