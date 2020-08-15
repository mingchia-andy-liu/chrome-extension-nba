import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import DatePicker from '../DatePicker'
import CardList from '../../components/CardList'
import {
  DarkModeCheckbox,
  NoSpoilerCheckbox,
  BroadcastCheckbox,
} from '../../components/Checkbox'
import { DATE_FORMAT } from '../../utils/constant'
import { ButtonsWrapper } from '../../styles'
import { fetchGamesIfNeeded } from '../Popup/actions'
import { dispatchChangeDate } from '../DatePicker/actions'
import {
  fetchLiveGameBoxIfNeeded,
  fetchGameHighlightIfNeeded,
} from '../BoxScoresDetails/actions'

const Wrapper = styled.div`
  grid-area: sidebar;
`

const Sidebar = ({
  date,
  id,
  fetchGamesIfNeeded,
  fetchLiveGameBoxIfNeeded,
  fetchGameHighlightIfNeeded,
  history,
  location,
  live,
}) => {
  const [gameId, toggleGameId] = React.useState(id || '')

  // useRef for prevProps.
  // set it after the fetch effect
  const prevCountRef = React.useRef()
  React.useEffect(() => {
    const prevDate = prevCountRef.current
    if (!isSameDay(date, prevDate)) {
      // props is already updated date, force update.
      fetchGamesIfNeeded(format(date, DATE_FORMAT), null, true, false)
      prevCountRef.current = date
    }
  }, [date, fetchGamesIfNeeded])

  const selectGame = React.useCallback(
    (e) => {
      const id = e.currentTarget.dataset.id
      const pathname = location.pathname

      if (pathname.startsWith('/boxscores')) {
        history.replace(`/boxscores/${id}`)
      } else {
        history.push(`/boxscores/${id}`)
      }
      const dateStr = format(date, DATE_FORMAT)
      fetchLiveGameBoxIfNeeded(dateStr, id).then(() => {
        fetchGameHighlightIfNeeded(id)
      })
      toggleGameId(id)
    },
    [date, history, location]
  )

  const dateOnChange = React.useCallback((newDate) => {
    history.replace('/boxscores')
    toggleGameId('')
  }, [history])

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
      />
    </Wrapper>
  )
}

Sidebar.propTypes = {
  id: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  live: PropTypes.object.isRequired,

  fetchGamesIfNeeded: PropTypes.func.isRequired,
  fetchLiveGameBoxIfNeeded: PropTypes.func.isRequired,
  fetchGameHighlightIfNeeded: PropTypes.func.isRequired,
  dispatchChangeDate: PropTypes.func.isRequired,

  history: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }),
}

const mapStateToProps = ({ live }) => ({
  live,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchGamesIfNeeded,
      dispatchChangeDate,
      fetchLiveGameBoxIfNeeded,
      fetchGameHighlightIfNeeded,
    },
    dispatch
  )
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar))
