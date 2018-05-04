import React, {Fragment} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ColumnCSS } from '../styles'
import Card from './Card'


const Wrapper = styled.div`
    ${ColumnCSS}
    width: 100%;
`

const sanitizeGame = (game) => ({
    gid: game.gid,
    stt: game.stt,
    cl: game.cl,
    hta: game.h.ta,
    vta: game.v.ta,
    htn: game.h.tn,
    vtn: game.v.tn,
    hs: game.h,
    vs: game.v,
    broadcaster: game.bd ? game.bd : '',
    series: game.stt === 'Final' ? '' : game.lm.seri,
})

const generateCards = (games, rest) => {
    return (
        <Fragment>
            {games.map((game, index) =>
                <Card key={`card-${index}`} {...sanitizeGame(game)} {...rest}/>
            )}
        </Fragment>
    )
}


class CardList extends React.PureComponent {
    render() {
        const { games, ...rest} = this.props
        if (games.length === 0) {
            return (
                <Wrapper>
                    <Card nogame {...rest}/>
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
}

export default CardList
