import { getLeagueYear } from '../../utils/getApiDate'
import types from './types'

export const fetchPlayoff = () => async (dispatch) => {
  try {
    dispatch({ type: types.REQUEST_START })
    const year = getLeagueYear(new Date())

    let bracket = []
    let isProxy = true
    try {
      const res = await fetch(
        `https://api.boxscores.site/v1/playoff?Season=${year}`
      )
      const { playoffBracketSeries } = await res.json()
      bracket = playoffBracketSeries
    } catch (error) {
      const res = await fetch(
        `https://stats.nba.com/stats/playoffbracket?SeasonYear=${year}&LeagueID=00&State=2`
      )
      const {
        bracket: { playoffBracketSeries },
      } = await res.json()
      bracket = playoffBracketSeries
      isProxy = false
    }

    dispatch({
      type: types.REQUEST_SUCCESS,
      payload: {
        version: 1,
        series: bracket || [],
        isProxy,
      },
    })
  } catch (error) {
    dispatch({ type: types.REQUEST_ERROR })
  }
}
