import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
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
import { dispatchChangeDate } from '../DatePicker/actions'

const Wrapper = styled.div`
  grid-area: sidebar;
`

const Sidebar = ({
  date,
  id,
  fetchGamesIfNeeded,
  fetchGameHighlightIfNeeded,
  live,
  dispatchChangeDate,
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [gameId, toggleGameId] = React.useState(id || '')
  const dateStr = format(date, DATE_FORMAT)
  const queryDate = getDateFromQuery(location)

  // useRef for prevProps. Used for calendar or initial render
  // set it after the fetch effect
  const prevCountRef = React.useRef()
  React.useEffect(() => {
    const gameDate = queryDate == null ? dateStr : queryDate
    const gameDateObj = parse(gameDate, DATE_FORMAT, startOfDay(new Date()))

    const prevDate = prevCountRef.current
    if (!isSameDay(prevDate, gameDateObj) || !isSameDay(date, gameDateObj)) {
      prevCountRef.current = gameDateObj

      dispatchChangeDate(gameDateObj)
        .then(() => {
          if (location.search !== '') {
            navigate({ pathname: location.pathname, search: '' })
          }
        })
        .then(() => {
          fetchGamesIfNeeded(
            format(gameDateObj, DATE_FORMAT),
            null,
            true,
            false
          )
        })
        .then(fetchGameHighlightIfNeeded)
    }
  }, [
    date,
    dateStr,
    dispatchChangeDate,
    fetchGamesIfNeeded,
    fetchGameHighlightIfNeeded,
    location.pathname,
    location.search,
    navigate,
    queryDate,
  ])

  const selectGame = React.useCallback(
    (e) => {
      const id = e.currentTarget.dataset.id
      const pathname = location.pathname

      if (pathname.startsWith('/boxscores')) {
        navigate(`/boxscores/${id}`, { replace: true })
      } else {
        navigate(`/boxscores/${id}`)
      }
      toggleGameId(id)
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
  date: PropTypes.object.isRequired,
  live: PropTypes.object.isRequired,

  fetchGamesIfNeeded: PropTypes.func.isRequired,
  fetchGameHighlightIfNeeded: PropTypes.func.isRequired,
  dispatchChangeDate: PropTypes.func.isRequired,
}

const mapStateToProps = ({ live }) => ({
  live,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchGamesIfNeeded,
      dispatchChangeDate,
      fetchGameHighlightIfNeeded,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
