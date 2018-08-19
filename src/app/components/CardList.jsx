import React, {Fragment} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ColumnCSS } from '../styles'
import { TextCard, MatchCard } from './Card'
import { SettingsConsumer } from './Context'


const Wrapper = styled.div`
    ${ColumnCSS}
    width: 100%;
`

const generateCards = (games, selected, favTeam, rest) => {
    const g = [...games]
    const favTeamIndex = g.findIndex(({home, visitor}) => home.abbreviation === favTeam || visitor.abbreviation === favTeam)
    const favTeamMatch = g[favTeamIndex]
    if (favTeamIndex >= 0) {
        g.splice(favTeamIndex, 1)
    }
    return (
        <Fragment>
            {favTeamMatch && <MatchCard
                selected={favTeamMatch.id === selected}
                {...favTeamMatch}
                {...rest}
            />}
            {g.map((game, index) =>
                <MatchCard
                    selected={game.id === selected}
                    key={`card-${index}`}
                    {...game}
                    {...rest}
                />
            )}
        </Fragment>
    )
}


class CardList extends React.PureComponent {
    render() {
        const { games, isLoading, selected, ...rest} = this.props
        if (isLoading) {
            return (
                <Wrapper>
                    <TextCard text={'Loading...'} />
                </Wrapper>
            )
        }
        if (games.length === 0) {
            return (
                <Wrapper>
                    <TextCard text={'No games today ¯\\_(ツ)_/¯'} />
                </Wrapper>
            )
        }

        return (
            <SettingsConsumer>
                {({state: { team }}) => (
                    <Wrapper>
                        {generateCards(games, selected, team, rest)}
                    </Wrapper>
                )}
            </SettingsConsumer>
        )
    }
}

CardList.propTypes = {
    games: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool,
    selected: PropTypes.string.isRequired,
}

CardList.defaultProps = {
    isLoading: false,
}

export default CardList
