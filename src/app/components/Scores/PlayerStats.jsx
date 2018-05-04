import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell, Sup, formatMinutes, toPercentage } from '../../utils/format'

const Wrapper = styled.div`
    width: 100%;
`

const PlayerName = styled(Cell)`
    display: flex !important;
    flex-direction: row;
    text-align: left;
    align-items: center;
    border-right: 1px solid hsl(0, 0%, 95%);
`

const renderHeaderRow = (num) => {
    const headers = [
        'Player',
        'MIN',
        'PTS',
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
        '+/-'
    ]

    return (
        <Row>
            {headers.map(element => (
                <HeaderCell key={`stats-${element}-${num}`}>{element}</HeaderCell>
            ))}
        </Row>
    )
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
        <Row key={`${player.fn}-${player.ln}`}>
            <PlayerName style={{ minWidth: '120px' }}>
                {`${fn} ${ln}`}
                {player.pos && <Sup>{player.pos}</Sup>}
                {isLive && player.court && <img src="assets/png/icon-color-48.png"></img>}
            </PlayerName>
            <Cell>{formatMinutes(player)}</Cell>
            <Cell>{player.pts}</Cell>
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
        </Row>
    )
}

class PlayerStats extends React.PureComponent {
    render() {
        const { hpstsg, vpstsg, isLive } = this.props
        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0}>
                    {renderHeaderRow(0)}
                    {hpstsg.map(player => (renderPlayerRow(player, isLive)))}
                    {renderHeaderRow(1)}
                    {vpstsg.map(player => (renderPlayerRow(player, isLive)))}
                </StickyTable>
            </Wrapper>
        )
    }
}

PlayerStats.propTypes = {
    hpstsg: PropTypes.array.isRequired,
    vpstsg: PropTypes.array.isRequired,
    isLive: PropTypes.bool,
}

PlayerStats.defaultProps = {
    isLive: false,
}


export default PlayerStats
