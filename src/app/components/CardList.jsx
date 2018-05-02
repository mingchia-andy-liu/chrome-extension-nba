import React, {Fragment} from 'react'
import stlyed from 'styled-components'
import {ColumnCSS} from '../styles'
import Card from './Card'
import {formatGames, gamesAPI} from '../utils/format'


const List = stlyed.div`
    ${ColumnCSS}
    padding: 0 5px;
`;


class CardList extends React.Component {
    constructor(props) {
        super(props)
    }

    generateCards(games) {
        return (
            <Fragment>
                {games.map((element, index) =>
                    <Card key={`card-${index}`} {...element} />
                )}
            </Fragment>
        )
    }

    render() {
        return (
            <List>
                {this.generateCards(formatGames(gamesAPI.gs.g))}
            </List>
        )
    }
}

export default CardList
