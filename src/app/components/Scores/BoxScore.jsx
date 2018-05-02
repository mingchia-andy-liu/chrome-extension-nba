import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table';
import { Cell, HeaderCell, RowHeaderCell } from '../../utils/format'
import { Flex } from '../../styles'

const Wrapper = styled.div`
    width: 100%;
`;


const renderHeaderRow = () => {
    const headers = [
        'Player',
        'MIN',
        'FGM-A',
        'FG%',
        '3PM-A',
        '3P%',
        'FTM-A',
        'FT%',
        'OREB',
        'DREB',
        'REB',
        'AST',
        'STL',
        'BLK',
        'TOV',
        'PF',
        '+/-',
        'PTS'
    ]

    return headers.map(element => {
        <HeaderCell>{element}</HeaderCell>
    })
}

/**
 * Migrate from `formatBoxScoreData()`
 * @param {*} player
 * @param {*} isLive
 */
const renderPlayerRow = (player, isLive) => {
    const fn = player && player.fn.trim() ? player.fn.charAt(0) + '.' : ''
    const ln = player.ln

    return (
        <Row>
            <Cell style={{textAlign: 'left'}}>
                {`${fn} ${ln}`}
                {player.pos && <Sup>{player.pos}</Sup>}
                {isLive && player.court && <img src="assets/png/icon-color-48.png"></img>}
            </Cell>
            <Cell>{formatMinutes(player)}</Cell>
            <Cell>{player.fgm.toString() + '-' + player.fga.toString()}</Cell>
            <Cell>{toPercentage(player.fgm / player.fga)}</Cell>
            <Cell>{player.tpm.toString() + '-' + player.tpa.toString()}</Cell>
            <Cell>{toPercentage(player.tpm / player.tpa)}</Cell>
            <Cell>{player.ftm.toString() + '-' + player.fta.toString()}</Cell>
            <Cell>{toPercentage(player.ftm / player.fta)}</Cell>
            <Cell>{player.oreb}</Cell>
            <Cell>{player.dreb}</Cell>
            <Cell>{player.reb}</Cell>
            <Cell>{player.ast}</Cell>
            <Cell>{player.stl}</Cell>
            <Cell>{player.blk}</Cell>
            <Cell>{player.tov}</Cell>
            <Cell>{player.pf}</Cell>
            <Cell>{player.pm !== undefined ? player.pm : ''}</Cell>
            <Cell>{player.pts}</Cell>
        </Row>
    )
}

class BoxScore extends React.PureComponent {
    render() {
        const { player, isLive } = this.props
        return (
            <Wrapper>
                <StickyTable>
                    {renderHeaderRow()}
                    {renderPlayerRow(player, isLive)}
                </StickyTable>
            </Wrapper>
        )
    }
}

BoxScore.propTypes = {
    player: PropTypes.object.isRequired,
    isLive: PropTypes.bool,
}

BoxScore.defaultProps = {
    isLive: false,
}


export default BoxScore
