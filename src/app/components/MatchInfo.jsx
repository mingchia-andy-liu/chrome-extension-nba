import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../styles'
import { SettingsConsumer, ThemeConsumer } from '../components/Context'
import { Theme } from '../styles'
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
                    <TeamScore> --- </TeamScore>
                    -
                    <TeamScore> --- </TeamScore>
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

const renderStatusAndClock = (spoiler, status, clock, totalPeriod, gameStatus) => {
    // if no spoiler is on, show the final status for games.
    if (spoiler && gameStatus === '2') {
        return ''
    }
    return formatClock(clock, status, totalPeriod) || status
}

const renderBroadcasters = (broadcasters, gameStatus) => {
    return broadcasters.map(broadcaster => {
        if (broadcaster.scope === 'natl') {
            return (
                <div key={broadcaster.display_name}>{broadcaster.display_name}</div>
            )
        }
        // don't show local broadcaster if the game has started/over
        if (gameStatus !== '1' ) {
            return null
        }
        return (
            <SubText key={broadcaster.display_name}>{broadcaster.display_name}</SubText>
        )
    })
}

class MatchInfo extends React.PureComponent {
    render() {
        const {
            broadcasters,
            home,
            visitor,
            periodTime: {
                periodStatus,
                gameClock,
                gameStatus,
                periodValue,
            },
            playoffs,
        } = this.props

        let series = ''
        if (playoffs) {
            const { home_wins: homeWins, visitor_wins: visitorWins } = playoffs
            if (+homeWins > +visitorWins) {
                series = `${home.nickname} leads series ${homeWins}-${visitorWins}`
            } else if (+homeWins < +visitorWins) {
                series = `${visitor.nickname} leads series ${visitorWins}-${homeWins}`
            } else {
                series = `Series tied ${homeWins}-${visitorWins}`
            }
        }


        return (
            <ThemeConsumer>
                {({ state: {dark} }) => (
                    <SettingsConsumer>
                        {({state: {spoiler}}) => (
                            <Wrapper>
                                {renderScores(dark, spoiler, gameStatus, home, visitor)}
                                <div>
                                    {renderStatusAndClock(spoiler, periodStatus, gameClock, periodValue, gameStatus)}
                                </div>
                                {!spoiler && series && <div>{series}</div>}
                                {broadcasters != null  && renderBroadcasters(broadcasters, gameStatus)}
                            </Wrapper>
                        )}
                    </SettingsConsumer>
                )}
            </ThemeConsumer>
        )
    }
}

MatchInfo.propTypes = {
    broadcasters: PropTypes.array,
    home: PropTypes.shape({
        abbreviation: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        score: PropTypes.string,
    }).isRequired,
    visitor: PropTypes.shape({
        abbreviation: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        score: PropTypes.string,
    }).isRequired,
    periodTime: PropTypes.shape({
        periodStatus: PropTypes.string.isRequired,
        gameClock: PropTypes.string.isRequired,
        gameStatus: PropTypes.string.isRequired,
    }).isRequired,
    playoffs: PropTypes.shape({
        home_wins: PropTypes.string,
        visitor_wins: PropTypes.string,
    }),
}

MatchInfo.defaultProps = {
    broadcasters: [],
}

export default MatchInfo
