import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell, RowHeaderCell } from '../../utils/format'

const Wrapper = styled.div`
    width: 100%;
`

const renderTeamRow = (team, otherTeam) => (
    <Row>
        <RowHeaderCell style={{ minWidth: '120px' }}>{team.abbreviation}</RowHeaderCell>
        {team.linescores.period.map((period, index) => (
            <Cell
                key={`period-${period.peroid_value}-${index}`}
                winning={+period.score > +otherTeam.linescores.period[index].score ? 1 : 0}
            >
                {period.score}
            </Cell>
        ))}
        <Cell winning={+team.score > +otherTeam.score ? 1 : 0}>{team.score}</Cell>
    </Row>
)

class Summary extends React.PureComponent {
    render() {
        const { home, visitor } = this.props
        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0}>
                    <Row>
                        <RowHeaderCell> Team </RowHeaderCell>
                        {home.linescores.period.map(period => (
                            // TODO: hides the unstart peroid
                            <HeaderCell key={`period-${period.period_value}`}> {period.period_name} </HeaderCell>
                        ))}
                        <HeaderCell> Final </HeaderCell>
                    </Row>
                    {renderTeamRow(home, visitor)}
                    {renderTeamRow(visitor, home)}
                </StickyTable>
            </Wrapper>
        )
    }
}

Summary.propTypes = {
    home: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
}


export default Summary
