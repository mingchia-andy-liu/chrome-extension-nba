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
    const fn = player && player.first_name.trim() ? player.first_name.charAt(0) + '.' : ''
    const ln = player.last_name
    const name = player.last_name !== '' ? `${fn} ${ln}` : player.first_name

    return (
        <Row key={`${player.fn}-${player.ln}`}>
            <PlayerName style={{ minWidth: '120px' }}>
                {name}
                {player.starting_position && <Sup>{player.starting_position}</Sup>}
                {isLive && +player.on_court && <img src="assets/png/icon-color-48.png"></img>}
            </PlayerName>
            <Cell>{formatMinutes(player)}</Cell>
            <Cell>{player.points}</Cell>
            <Cell>{`${player.field_goals_made}-${player.field_goals_attempted}`}</Cell>
            <Cell>{toPercentage(+player.field_goals_made / +player.field_goals_attempted)}</Cell>
            <Cell>{`${player.three_pointers_made}-${player.three_pointers_attempted}`}</Cell>
            <Cell>{toPercentage(+player.three_pointers_made / +player.three_pointers_attempted)}</Cell>
            <Cell>{`${player.free_throws_made}-${player.free_throws_attempted}`}</Cell>
            <Cell>{toPercentage(+player.free_throws_made / +player.free_throws_attempted)}</Cell>
            <Cell>{player.rebounds_offensive}</Cell>
            <Cell>{player.rebounds_defensive}</Cell>
            <Cell>{+player.rebounds_offensive + +player.rebounds_defensive}</Cell>
            <Cell>{player.assists}</Cell>
            <Cell>{player.steals}</Cell>
            <Cell>{player.blocks}</Cell>
            <Cell>{player.turnovers}</Cell>
            <Cell>{player.fouls}</Cell>
            <Cell>{player.plus_minus}</Cell>
        </Row>
    )
}

class PlayerStats extends React.PureComponent {
    render() {
        const { hps, vps, isLive } = this.props
        if ( hps.length === 0 || vps.length === 0) {
            return (
                <Wrapper>
                    No Player Data Avaiable
                </Wrapper>
            )
        }

        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0}>
                    {renderHeaderRow(0)}
                    {vps.map(player => (renderPlayerRow(player, isLive)))}
                    {renderHeaderRow(1)}
                    {hps.map(player => (renderPlayerRow(player, isLive)))}
                </StickyTable>
            </Wrapper>
        )
    }
}

PlayerStats.propTypes = {
    hps: PropTypes.array.isRequired,
    vps: PropTypes.array.isRequired,
    isLive: PropTypes.bool,
}

PlayerStats.defaultProps = {
    isLive: false,
}


export default PlayerStats
