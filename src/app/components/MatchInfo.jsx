import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row } from '../styles'


const Wrapper = styled.div`
    flex-basis: 40%;
    text-align: center;

    & > * {
        margin-top: 5px;
    }
`

const TeamScore = styled.div`
    flex-grow: 2;
    ${props => props.winning && 'color: green;'};
`


class MatchInfo extends React.PureComponent {
    render() {
        const {
            home,
            visitor,
            periodTime: {
                periodStatus,
                gameClock,
                gameStatus,
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
                <Row>
                    <TeamScore winning={visitor.score > home.score ? 1 : 0}> {visitor.score} </TeamScore>
                    {gameStatus !== '1' && '-'}
                    <TeamScore winning={visitor.score < home.score ? 1 : 0}> {home.score} </TeamScore>
                </Row>
                <div>{`${periodStatus} ${gameClock}`}</div>
                {series && <div>{series}</div>}
            </Wrapper>
        )
    }
}

MatchInfo.propTypes = {
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

}

export default MatchInfo
