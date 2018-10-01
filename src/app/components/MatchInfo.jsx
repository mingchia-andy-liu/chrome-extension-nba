import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../styles'
import { SettingsConsumer } from '../components/Context'
import { Theme } from '../styles'
import {formatClock} from '../utils/format'


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
    opacity: ${(props) => (props.losing ? '0.5' : '')};
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
    if (spoiler && gameStatus !== '1') {
        return ''
    }
    return formatClock(clock, status) || status
}

class MatchInfo extends React.PureComponent {
    render() {
        const {
            broadcaster,
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
            <SettingsConsumer>
                {({state: {dark, spoiler}}) => (
                    <Wrapper>
                        {renderScores(dark, spoiler, gameStatus, home, visitor)}
                        <div>
                            {renderStatusAndClock(spoiler, periodStatus, gameClock, periodValue, gameStatus)}
                        </div>
                        {!spoiler && series && <div>{series}</div>}
                        {gameStatus === '1' && broadcaster !== '' && <div>{broadcaster}</div>}
                    </Wrapper>
                )}
            </SettingsConsumer>
        )
    }
}

MatchInfo.propTypes = {
    broadcaster: PropTypes.string,
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
    broadcaster: '',
}

export default MatchInfo
