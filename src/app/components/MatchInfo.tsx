import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Theme } from '../styles'
import { SettingsConsumer, ThemeConsumer } from '../components/Context'
import { formatClock } from '../utils/common'

const Wrapper = styled.div`
  flex-basis: 40%;
  text-align: center;

  & > * {
    margin-top: 5px;
  }
`

const TeamScore = styled.div`
  flex-grow: 2;
  color: ${(props) => {
    if (props.dark && props.winning) return Theme.dark.winning
    if (props.winning) return Theme.light.winning
  }};
  opacity: ${(props) => (props.losing ? '0.4' : '')};
`

const SubText = styled.div`
  font-size: calc(12px + 0.1vw);
  color: hsl(0, 0%, 50%);
`

const renderScores = (dark, spoiler, gameStatus, home, visitor) => {
  if (gameStatus !== '1') {
    if (spoiler) {
      return (
        <Row>
          <TeamScore> --- </TeamScore>-<TeamScore> --- </TeamScore>
        </Row>
      )
    }
    return (
      <Row>
        <TeamScore
          dark={dark}
          winning={+visitor.score > +home.score}
          losing={+visitor.score < +home.score}
        >
          {visitor.score}
        </TeamScore>
        -
        <TeamScore
          dark={dark}
          winning={+visitor.score < +home.score}
          losing={+visitor.score > +home.score}
        >
          {home.score}
        </TeamScore>
      </Row>
    )
  }
}

const renderStatusAndClock = (status, clock, totalPeriod) => {
  return formatClock(clock, status, totalPeriod) || status
}

const renderBroadcasters = (broadcasters, gameStatus) => {
  return broadcasters.map((broadcaster) => {
    if (broadcaster.scope === 'natl') {
      return (
        <div key={broadcaster.display_name}>{broadcaster.display_name}</div>
      )
    }
    // don't show local broadcaster if the game has started/over
    if (gameStatus !== '1') {
      return null
    }
    return (
      <SubText key={broadcaster.display_name}>
        {broadcaster.display_name}
      </SubText>
    )
  })
}

const renderAt = (gameStatus) => {
  if (gameStatus === '1') {
    return <div>@</div>
  }
}

const renderHighlight = (id, urls, dark) => {
  if (id == null || urls == null || urls[id] == null) {
    return undefined
  }

  return (
    <a
      href={`https://youtube.com/watch?v=${urls[id]}`}
      style={{
        fontSize: 'smaller',
        color: dark ? 'lightblue' : undefined,
      }}
    >
      Highlight
    </a>
  )
}

const MatchInfo = ({
  id,
  broadcasters,
  home,
  visitor,
  periodTime: { periodStatus, gameClock, gameStatus, periodValue },
  playoffs,
  urls,
}) => {
  let series = ''
  if (playoffs) {
    const { home_wins: homeWins, visitor_wins: visitorWins } = playoffs
    if (homeWins != null && visitorWins != null) {
      if (+homeWins > +visitorWins) {
        series = `${home.nickname} leads series ${homeWins}-${visitorWins}`
      } else if (+homeWins < +visitorWins) {
        series = `${visitor.nickname} leads series ${visitorWins}-${homeWins}`
      } else if (+homeWins === +visitorWins) {
        series = `Series tied ${homeWins}-${visitorWins}`
      }
    }
  }

  return (
    <ThemeConsumer>
      {({ state: { dark } }) => (
        <SettingsConsumer>
          {({ state: { spoiler } }) => (
            <Wrapper>
              {renderScores(dark, spoiler, gameStatus, home, visitor)}
              {renderAt(gameStatus)}
              <div>
                {renderStatusAndClock(periodStatus, gameClock, periodValue)}
              </div>
              {!spoiler && series && <div>{series}</div>}
              {broadcasters != null &&
                renderBroadcasters(broadcasters, gameStatus)}
              {renderHighlight(id, urls, dark)}
            </Wrapper>
          )}
        </SettingsConsumer>
      )}
    </ThemeConsumer>
  )
}

MatchInfo.propTypes = {
  id: PropTypes.string,
  broadcasters: PropTypes.array,
  home: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    score: PropTypes.string,
    nickname: PropTypes.string.isRequired,
  }).isRequired,
  visitor: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    score: PropTypes.string,
    nickname: PropTypes.string.isRequired,
  }).isRequired,
  periodTime: PropTypes.shape({
    periodStatus: PropTypes.string.isRequired,
    gameClock: PropTypes.string.isRequired,
    gameStatus: PropTypes.string.isRequired,
    // TODO: update type
    periodValue: PropTypes.any.isRequired,
  }).isRequired,
  playoffs: PropTypes.shape({
    home_wins: PropTypes.string,
    visitor_wins: PropTypes.string,
  }),
  urls: PropTypes.object,
}

MatchInfo.defaultProps = {
  broadcasters: [],
}

export default MatchInfo
