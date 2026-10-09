import React from 'react'
import { connect, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import CardList from '../../components/CardList'
import {
  DarkModeCheckbox,
  NoSpoilerCheckbox,
  BroadcastCheckbox,
} from '../../components/Checkbox'
import DatePicker from '../../containers/DatePicker'
import Links from '../../components/Links'
import { Column, ButtonsWrapper } from '../../styles'
import * as actions from './actions'
import { DATE_FORMAT } from '../../utils/constant'
import browser from '../../utils/browser'
import { selectDate } from '../DatePicker/dateSlice'

const Wrapper = styled(Column)`
  padding: 10px;
  width: 100%;
  min-width: 450px;
`

const PopUp = ({ fetchGamesIfNeeded, fetchGameHighlightIfNeeded, live }) => {
  const date = useSelector(selectDate)
  const navigate = useNavigate()
  const [isPopup, togglePopup] = React.useState(false)
  const [gameDate, toggleGameDate] = React.useState(format(date, DATE_FORMAT))
  // useRef for previous selected date.
  const prevDateRef = React.useRef()

  React.useEffect(() => {
    browser.tabs.getCurrent((tab) => {
      togglePopup(!tab)
    })
    const dateStr = format(date, DATE_FORMAT)
    fetchGamesIfNeeded(dateStr, null, true).then(fetchGameHighlightIfNeeded)
    document.title = 'Box Scores | Popup'
    prevDateRef.current = date
  }, [])

  // this is used to trace the toggle for different "selected" dates.
  React.useEffect(() => {
    const prevDate = prevDateRef.current
    if (prevDate != null && !isSameDay(date, prevDate)) {
      // props is already updated date, force update.
      fetchGamesIfNeeded(format(date, DATE_FORMAT), null, true, false).then(
        fetchGameHighlightIfNeeded
      )
      prevDateRef.current = date
    }
  }, [date, fetchGamesIfNeeded])

  const selectGame = React.useCallback(
    (e) => {
      const id = e.currentTarget.dataset.id
      if (isPopup) {
        browser.tabs.create({
          url: `/index.html#/boxscores/${id}?date=${gameDate}`,
        })
        window.close()
      } else {
        navigate(`/boxscores/${id}`)
      }
    },
    [gameDate, isPopup, navigate]
  )

  const onDateChange = React.useCallback(
    (newDate) => {
      toggleGameDate(newDate)
    },
    [toggleGameDate]
  )

  return (
    <Wrapper>
      <DatePicker hide={isPopup} onChange={onDateChange} />
      <Links />
      <ButtonsWrapper>
        <DarkModeCheckbox />
        <NoSpoilerCheckbox />
        <BroadcastCheckbox />
      </ButtonsWrapper>
      <CardList
        hasError={live.hasError}
        selected={'0'}
        isLoading={live.isLoading}
        games={live.games}
        onClick={selectGame}
        urls={live.urls}
      />
    </Wrapper>
  )
}

PopUp.propTypes = {
  live: PropTypes.shape({
    hasError: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    games: PropTypes.array.isRequired,
    // date
    lastUpdate: PropTypes.object.isRequired,
    // { [gid]: string }
    urls: PropTypes.object.isRequired,
  }).isRequired,
  fetchGamesIfNeeded: PropTypes.func.isRequired,
  fetchGameHighlightIfNeeded: PropTypes.func.isRequired,
}

const mapStateToProps = ({ live }) => ({
  live,
})

export default connect(mapStateToProps, actions)(PopUp)
