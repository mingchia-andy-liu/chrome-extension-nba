import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell as FormatHeaderCell, RowHeaderCell } from '../../utils/format'
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

class TeamStats extends React.PureComponent {
    render() {
        const { home, hta, visitor, vta, extra } = this.props
        return (
            <Wrapper>
                <ThemeConsumer>
                    {({state: { dark }}) => (
                        <StickyTable stickyHeaderCount={0}>
                            {renderHeaderRow(0)}
                            {renderTeamRow(visitor, vta, dark)}
                            {renderTeamRow(home, hta, dark, 1)}
                        </StickyTable>
                    )}
                </ThemeConsumer>
                <div  style={{marginTop: '15px'}}>
                    <StickyTable>
                        <Row>
                            <HeaderCell>Lead Changes</HeaderCell>
                            <HeaderCell>Times Tied</HeaderCell>
                        </Row>
                        <Row>
                            <Cell>{extra.leadChanges}</Cell>
                            <Cell>{extra.timesTied}</Cell>
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
        leadChanges: PropTypes.number.isRequired,
        timesTied: PropTypes.number.isRequired,
    }),
}


export default TeamStats
