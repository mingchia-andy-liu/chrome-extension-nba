import React, {Fragment} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { mediaQuery } from '../styles'
import { TextCard, MatchCard } from './Card'
import { SidebarConsumer } from './Context'
import browser from '../utils/browser'


const Wrapper = styled.div`
    display: block;
    width: 100%;

    ${mediaQuery`
        min-height: 100px;
        max-height: 250px;
        padding: 0 5px 10px 5px;
        ${(props) => (props.isPopup && 'max-height: 350px;')}
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
            <SidebarConsumer>
                {({state: { broadcast, team }}) => (
                    <Wrapper isPopup={isPopup}>
                        {generateCards(games, selected, team, broadcast, rest)}
                    </Wrapper>
                )}
            </SidebarConsumer>
        )
    }
}

CardList.propTypes = {
    games: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool,
    selected: PropTypes.string,
}

CardList.defaultProps = {
    isLoading: false,
    selected: '',
}

export default CardList
