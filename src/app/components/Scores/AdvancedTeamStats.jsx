import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell as FormatHeaderCell, RowHeaderCell } from '../../utils/format'

const Wrapper = styled.div`
    width: 100%;
`

const HeaderCell = styled(FormatHeaderCell)`
    width: 10vw;
`

const renderHeaderRow = () => {
    const headers = [
        'Biggest Lead',
        'Bench Pts',
        '2nd Chance Pts',
        'Fast Break Pts (M-A)',
        'Pts In Paint (M-A)',
        'Pts Off Turnovers'
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
        <Cell>{team.biggest_lead || 0}</Cell>
        <Cell>{team.bench_points || 0}</Cell>
        <Cell>{team.second_chance_points || 0}</Cell>
        <Cell>{team.fast_break_points || 0} ({team.fast_break_points_made || 0}-{team.fast_break_points_attempted || 0})</Cell>
        <Cell>{team.points_in_paint || 0} ({team.points_in_paint_made || 0}-{team.points_in_paint_attempted || 0})</Cell>
        <Cell>{team.points_off_turnovers || 0}</Cell>
    </Row>
)

class TeamStats extends React.PureComponent {
    render() {
        const { home, hta, visitor, vta, extra } = this.props
        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0}>
                    {renderHeaderRow(0)}
                    {renderTeamRow(home, hta)}
                    {renderTeamRow(visitor, vta)}
                </StickyTable>
                <div  style={{marginTop: '15px'}}>
                    <StickyTable>
                        <Row>
                            <HeaderCell>Lead Changes</HeaderCell>
                            <HeaderCell>Times Tied</HeaderCell>
                        </Row>
                        <Row>
                            <Cell>{extra.lead_changes}</Cell>
                            <Cell>{extra.times_tied}</Cell>
                        </Row>
                    </StickyTable>
                </div>
            </Wrapper>
        )
    }
}

TeamStats.propTypes = {
    home: PropTypes.object.isRequired,
    hta: PropTypes.string.isRequired,
    visitor: PropTypes.object.isRequired,
    vta: PropTypes.string.isRequired,
    extra: PropTypes.shape({
        lead_changes: PropTypes.number.isRequired,
        times_tied: PropTypes.number.isRequired,
    }),
}


export default TeamStats
