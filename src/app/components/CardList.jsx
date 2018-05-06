import React, {Fragment} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ColumnCSS } from '../styles'
import { TextCard, MatchCard } from './Card'


const Wrapper = styled.div`
    ${ColumnCSS}
    width: 100%;
`

const generateCards = (games, rest) => {
    return (
        <Fragment>
            {games.map((game, index) =>
                <MatchCard key={`card-${index}`} {...game} {...rest}/>
            )}
        </Fragment>
    )
}


class CardList extends React.PureComponent {
    render() {
        const { games, isLoading, ...rest} = this.props
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
            <Wrapper>
                {generateCards(games, rest)}
            </Wrapper>
        )
    }
}

CardList.propTypes = {
    games: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool,
}

CardList.defaultProps = {
    isLoading: false,
}

export default CardList
