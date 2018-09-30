import React, {Fragment} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ColumnCSS, mediaQuery } from '../styles'
import { TextCard, MatchCard } from './Card'
import { SettingsConsumer } from './Context'
import browser from '../utils/browser'


const Wrapper = styled.div`
    ${ColumnCSS}
    width: 100%;

    ${mediaQuery`
        min-height: 100px;
        padding: 0 5px 10px 5px;
        ${(props) => (props.isPopup && 'max-height: 250px;')}
        overflow-y: scroll;
    `}
`

const generateCards = (games, selected, favTeam, broadcast, rest) => {
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
                showBroadcast={broadcast}
                {...favTeamMatch}
                {...rest}
            />}
            {g.map((game, index) =>
                <MatchCard
                    selected={game.id === selected}
                    key={`card-${index}`}
                    showBroadcast={broadcast}
                    {...game}
                    {...rest}
                />
            )}
        </Fragment>
    )
}


class CardList extends React.PureComponent {
    constructor() {
        super()
        this.state = { isPopup: false }
    }

    componentDidMount() {
        browser.tabs.getCurrent((tab) => {
            this.setState({ isPopup: !tab })
        })
    }

    render() {
        const { games, isLoading, selected, ...rest} = this.props
        const { isPopup } = this.state
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
                {({state: { team, broadcast }}) => (
                    <Wrapper isPopup={isPopup}>
                        {generateCards(games, selected, team, broadcast, rest)}
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
