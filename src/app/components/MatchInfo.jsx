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
const Button = styled.button`
  border-radius: 5px;
  box-sizing: border-box;
  background-color: ${(props) => (props.dark ? 'black' : 'transparent')};
  border: 1px solid rgb(168, 199, 250);
  color: ${(props) => (props.dark ? 'rgb(168, 199, 250)' : 'rgb(11, 87, 208)')};
  padding: 1px 8px;
  outline-width: 0px;

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props.dark ? '#38393b' : 'rgb(197, 217, 215)'};
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
      // mock the game has not start symbol
      return renderAt('1')
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
  seriesText,
  showReveal = true,
  reveal,
  setReveal,
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
  } else if (seriesText) series = seriesText

  return (
    <ThemeConsumer>
      {({ state: { dark } }) => (
        <SettingsConsumer>
          {({ state: { spoiler } }) => (
            <Wrapper>
              {renderScores(
                dark,
                spoiler && !reveal,
                gameStatus,
                home,
                visitor
              )}
              {renderAt(gameStatus)}
              {/* either game has not start OR it has starts and the reveal has been clicked */}
              {(gameStatus == 1 ||
                (gameStatus != 1 && (reveal || !spoiler))) && (
                <div>
                  {renderStatusAndClock(periodStatus, gameClock, periodValue)}
                </div>
              )}
              {/* no spoiler is off || revel has been clicked */}
              {(!spoiler || reveal) && series && <div>{series}</div>}
              {/* in cards && game has started && no spoiler is on && revel has not been clicked */}
              {showReveal && gameStatus != 1 && spoiler && !reveal && (
                <Button
                  dark={dark}
                  onClick={(e) => {
                    e.stopPropagation()
                    setReveal(!reveal)
                  }}
                >
                  Reveal
                </Button>
              )}
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
  // whether or not to have the reveal button. In box score detail page, do not show it.
  showReveal: PropTypes.bool,
  reveal: PropTypes.bool,
  setReveal: PropTypes.func,
}

MatchInfo.defaultProps = {
  broadcasters: [],
}

export default MatchInfo
