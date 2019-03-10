import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell, RowHeaderCell, StatsCell } from '../../utils/format'
import { getOddRowColor } from '../../utils/common'
import { ThemeConsumer } from '../Context'

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
        'TREB',
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

const renderTeamRow = (team, name, isDark, i = 0) => {
    return (
        <Row style={{backgroundColor: getOddRowColor(i, isDark)}}>
            <RowHeaderCell> {name} </RowHeaderCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={team.field_goals_percentage >= 50 ? 1 : undefined}
                losing={team.field_goals_percentage <= 30 ? 1 : undefined}
            >{`${team.field_goals_made}-${team.field_goals_attempted}`}</StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={team.field_goals_percentage >= 50 ? 1 : undefined}
                losing={team.field_goals_percentage <= 30 ? 1 : undefined}
            >{team.field_goals_percentage}%</StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={team.three_pointers_percentage >= 50 ? 1 : undefined}
                losing={team.three_pointers_percentage <= 30 ? 1 : undefined}
            >{`${team.three_pointers_made}-${team.three_pointers_attempted}`}</StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={team.three_pointers_percentage >= 50 ? 1 : undefined}
                losing={team.three_pointers_percentage <= 30 ? 1 : undefined}
            >{team.three_pointers_percentage}%</StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={team.free_throws_percentage >= 90 ? 1 : undefined}
                losing={team.free_throws_percentage <= 60 ? 1 : undefined}
            >{`${team.free_throws_made}-${team.free_throws_attempted}`}</StatsCell>
            <StatsCell
                dark={isDark ? 1 : undefined}
                winning={team.free_throws_percentage >= 90 ? 1 : undefined}
                losing={team.free_throws_percentage <= 60 ? 1 : undefined}
            >{team.free_throws_percentage}%</StatsCell>
            <Cell>{team.team_rebounds}</Cell>
            <Cell>{team.rebounds_defensive + team.rebounds_offensive}</Cell>
            <Cell>{team.assists}</Cell>
            <Cell>{team.steals}</Cell>
            <Cell>{team.blocks}</Cell>
            <Cell>{team.turnovers}</Cell>
            <Cell>{team.fouls}</Cell>
        </Row>
    )
}

class TeamStats extends React.PureComponent {
    render() {
        const { hts, vts, hta, vta } = this.props
        return (
            <Wrapper>
                <ThemeConsumer>
                    {({state: { dark }})=> (
                        <StickyTable stickyHeaderCount={0}>
                            {renderHeaderRow(0)}
                            {renderTeamRow(vts, vta, dark)}
                            {renderTeamRow(hts, hta, dark, 1)}
                        </StickyTable>
                    )}
                </ThemeConsumer>
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
