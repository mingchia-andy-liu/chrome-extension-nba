import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Cell, HeaderCell as FormatHeaderCell, RowHeaderCell, Table, Row } from '../../utils/format'
import { getOddRowColor } from '../../utils/common'
import { ThemeConsumer } from '../Context'

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


const renderTeamRow = (team, name, isDark, i = 0) => (
    <Row style={{backgroundColor: getOddRowColor(i, isDark)}}>
        <RowHeaderCell> {name} </RowHeaderCell>
        <Cell>{team.biggestLead || 0}</Cell>
        <Cell>{team.benchPoints || 0}</Cell>
        <Cell>{team.secondChancePoints || 0}</Cell>
        <Cell>{team.fastBreakPoints || 0} ({team.fastBreakPointsMade || 0}-{team.fastBreakPointsAttempted || 0})</Cell>
        <Cell>{team.pointsInPaint || 0} ({team.pointsInPaintMade || 0}-{team.pointsInPaintAttempted || 0})</Cell>
        <Cell>{team.pointsOffTurnovers || 0}</Cell>
    </Row>
)

const TeamStats = ({home, hta, visitor, vta}) => {
    return (
        <Wrapper>
            <ThemeConsumer>
                {({state: { dark }}) => (
                    <Table>
                        <tbody>
                            {renderHeaderRow(0)}
                            {renderTeamRow(visitor, vta, dark)}
                            {renderTeamRow(home, hta, dark, 1)}
                        </tbody>
                    </Table>
                )}
            </ThemeConsumer>
        </Wrapper>
    )
}

TeamStats.propTypes = {
    home: PropTypes.object.isRequired,
    hta: PropTypes.string.isRequired,
    visitor: PropTypes.object.isRequired,
    vta: PropTypes.string.isRequired,
}


export default TeamStats
