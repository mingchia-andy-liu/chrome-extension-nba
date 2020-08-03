import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment-timezone'
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

const Wrapper = styled(Column)`
  padding: 10px;
  width: 100%;
  min-width: 370px;
`

const PopUp = ({ fetchGamesIfNeeded, history, date: { date }, live }) => {
  const [isPopup, togglePopup] = React.useState(false)
  const [gameDate, toggleGameDate] = React.useState(
    moment(date).format(DATE_FORMAT)
  )

  React.useEffect(() => {
    browser.tabs.getCurrent((tab) => {
      togglePopup(!tab)
    })
    const dateStr = moment(date).format(DATE_FORMAT)
    fetchGamesIfNeeded(dateStr, null, true)
    document.title = 'Box Scores | Popup'
  }, [])

  // useRef for previous date.
  const prevDateRef = React.useRef()
  React.useEffect(() => {
    const prevDate = prevDateRef.current
    if (!moment(date).isSame(prevDate)) {
      // props is already updated date, force update.
      fetchGamesIfNeeded(moment(date).format(DATE_FORMAT), null, true, false)
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
        history.push(`/boxscores/${id}`)
      }
    },
    [gameDate, isPopup]
  )

  const selectDate = React.useCallback(
    (date) => {
      toggleGameDate(date)
    },
    [toggleGameDate]
  )

  return (
    <Wrapper>
      <DatePicker hide={isPopup} onChange={selectDate} />
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
  }).isRequired,
  date: PropTypes.shape({
    date: PropTypes.object.isRequired,
  }),
  fetchGamesIfNeeded: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
}

const mapStateToProps = ({ live, date }) => ({
  live,
  date,
})

export default withRouter(connect(mapStateToProps, actions)(PopUp))
