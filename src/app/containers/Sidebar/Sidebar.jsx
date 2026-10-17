import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import isValid from 'date-fns/isValid'
import startOfDay from 'date-fns/startOfDay'
import DatePicker from '../DatePicker'
import CardList from '../../components/CardList'
import {
  DarkModeCheckbox,
  NoSpoilerCheckbox,
  BroadcastCheckbox,
} from '../../components/Checkbox'
import { getDateFromQuery } from '../../utils/common'
import { DATE_FORMAT } from '../../utils/constant'
import { ButtonsWrapper } from '../../styles'
import {
  fetchGamesIfNeeded,
  fetchGameHighlightIfNeeded,
} from '../Popup/actions'
import { changeDate, selectDate } from '../DatePicker/dateSlice'
import { selectLive } from '../Popup/liveSlice'

const Wrapper = styled.div`
  grid-area: sidebar;
`

export const Sidebar = ({ id }) => {
  const dispatch = useDispatch()
  const date = useSelector(selectDate)
  const live = useSelector(selectLive)
  const location = useLocation()
  const navigate = useNavigate()
  const [gameId, toggleGameId] = React.useState(id || '')
  const dateStr = format(date, DATE_FORMAT)
  const queryDate = getDateFromQuery(location)
  const parsedQueryDate =
    typeof queryDate === 'string'
      ? parse(queryDate, DATE_FORMAT, startOfDay(new Date()))
      : null
  const hasValidQueryDate =
    parsedQueryDate &&
    isValid(parsedQueryDate) &&
    format(parsedQueryDate, DATE_FORMAT) === queryDate

  // useRef for prevProps. Used for calendar or initial render
  // set it after the fetch effect
  const prevCountRef = React.useRef()
  React.useEffect(() => {
    const gameDateObj = hasValidQueryDate ? parsedQueryDate : date

    const prevDate = prevCountRef.current
    if (!isSameDay(prevDate, gameDateObj) || !isSameDay(date, gameDateObj)) {
      prevCountRef.current = gameDateObj

      dispatch(changeDate(gameDateObj))
      dispatch(
        fetchGamesIfNeeded(format(gameDateObj, DATE_FORMAT), null, true, false)
      ).then(() => dispatch(fetchGameHighlightIfNeeded()))
    }
    if (location.search !== '') {
      navigate({ pathname: location.pathname, search: '' })
    }
  }, [
    date,
    dateStr,
    dispatch,
    location.pathname,
    location.search,
    navigate,
    hasValidQueryDate,
    parsedQueryDate,
  ])

  const selectGame = React.useCallback(
    (e) => {
      const selectedId = e.currentTarget.dataset.id
      const pathname = location.pathname

      if (pathname.startsWith('/boxscores')) {
        navigate(`/boxscores/${selectedId}`, { replace: true })
      } else {
        navigate(`/boxscores/${selectedId}`)
      }
      toggleGameId(selectedId)
    },
    [location.pathname, navigate]
  )

  const dateOnChange = React.useCallback(
    (newDate) => {
      navigate('/boxscores', { replace: true })
      toggleGameId('')
    },
    [navigate]
  )

  return (
    <Wrapper>
      <DatePicker startDate={date} onChange={dateOnChange} />
      <ButtonsWrapper>
        <DarkModeCheckbox />
        <NoSpoilerCheckbox />
        <BroadcastCheckbox />
      </ButtonsWrapper>
      <CardList
        hasError={live.hasError}
        isLoading={live.isLoading}
        isSidebar={true}
        games={live.games}
        onClick={selectGame}
        selected={gameId}
        urls={live.urls}
      />
    </Wrapper>
  )
}

Sidebar.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Sidebar
