import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell, RowHeaderCell } from '../../utils/format'

const Wrapper = styled.div`
    width: 100%;
`
const renderHeaderRow = () => {
    const headers = [
        'FGM-A',
        'FG%',
        '3PM-A',
        '3P%',
        'FTM-A',
        'FT%',
        'REB',
        'AST',
        'STL',
        'BLK',
        'TOV',
        'PF'
    ]

    return (
        <Row>
            <RowHeaderCell>Team</RowHeaderCell>
            {headers.map(element => (
                <HeaderCell key={`stats-${element}`}>{element}</HeaderCell>
            ))}
        </Row>
    )
}

const renderTeamRow = (team, name) => (
    <Row>
        <RowHeaderCell> {name} </RowHeaderCell>
        <Cell>{`${team.field_goals_made}-${team.field_goals_attempted}`}</Cell>
        <Cell>{team.field_goals_percentage}%</Cell>
        <Cell>{`${team.three_pointers_made}-${team.three_pointers_attempted}`}</Cell>
        <Cell>{team.three_pointers_percentage}%</Cell>
        <Cell>{`${team.free_throws_made}-${team.free_throws_attempted}`}</Cell>
        <Cell>{team.free_throws_percentage}%</Cell>
        <Cell>{team.team_rebounds}</Cell>
        <Cell>{team.assists}</Cell>
        <Cell>{team.steals}</Cell>
        <Cell>{team.blocks}</Cell>
        <Cell>{team.turnovers}</Cell>
        <Cell>{team.fouls}</Cell>
    </Row>
)

class TeamStats extends React.PureComponent {
    render() {
        const { hts, vts, hta, vta } = this.props
        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0}>
                    {renderHeaderRow(0)}
                    {renderTeamRow(hts, hta)}
                    {renderTeamRow(vts, vta)}
                </StickyTable>
            </Wrapper>
        )
    }
}

TeamStats.propTypes = {
    hts: PropTypes.object.isRequired,
    vts: PropTypes.object.isRequired,
    hta: PropTypes.string.isRequired,
    vta: PropTypes.string.isRequired,
}


export default TeamStats
