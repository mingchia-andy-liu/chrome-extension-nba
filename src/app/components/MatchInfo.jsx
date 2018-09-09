import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../styles'
import { SettingsConsumer } from '../components/Context'
import { Theme } from '../styles'


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
    opacity: ${(props) => (props.winning ? '' : '0.5')};
`

const renderScores = (gameStatus, home, visitor) => {
    if (gameStatus !== '1') {
        return (
            <SettingsConsumer>
                {({ state: { dark } }) => (
                    <Row >
                        <TeamScore dark={dark} winning={+visitor.score > +home.score ? 1 : 0}> {visitor.score} </TeamScore>
                        -
                        <TeamScore dark={dark} winning={+visitor.score < +home.score ? 1 : 0}> {home.score} </TeamScore>
                    </Row>
                )}
            </SettingsConsumer>
        )
    }
}

const renderStatusAndClock = (status, clock, totalPeriod ) => {
    if (status === 'Halftime') {
        return 'Halftime'
    } else if (status === 'Final' && totalPeriod > 4 ) {
        return 'Final/OT'
    } else {
        return `${status} ${clock}`
    }
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
            <Wrapper>
                {renderScores(gameStatus, home, visitor)}
                <div>{renderStatusAndClock(periodStatus, gameClock, periodValue)}</div>
                {series && <div>{series}</div>}
                {gameStatus === '1' && broadcaster !== '' && <div>{broadcaster}</div>}
            </Wrapper>
        )
    }
}

MatchInfo.propTypes = {
    broadcaster: PropTypes.string,
    home: PropTypes.shape({
        abbreviation: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        score: PropTypes.string,
    }),
    visitor: PropTypes.shape({
        abbreviation: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        score: PropTypes.string,
    }),
    periodTime: PropTypes.shape({
        periodStatus: PropTypes.string.isRequired,
        gameClock: PropTypes.string.isRequired,
        gameStatus: PropTypes.string.isRequired,
    }),
    playoffs: PropTypes.shape({
        home_wins: PropTypes.string,
        visitor_wins: PropTypes.string,
    }),
}

MatchInfo.defaultProps = {
    broadcaster: '',
}

export default MatchInfo
