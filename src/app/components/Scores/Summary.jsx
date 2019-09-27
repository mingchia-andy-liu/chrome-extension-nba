import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell, RowHeaderCell } from '../../utils/format'
import { getOddRowColor } from '../../utils/common'
import { ThemeConsumer } from '../Context'

const Wrapper = styled.div`
    width: 100%;
`

const renderTeamRow = (team, otherTeam, isDark, i = 0) => (
    <Row style={{backgroundColor: getOddRowColor(i, isDark)}}>
        <RowHeaderCell>{team.abbreviation}</RowHeaderCell>
        {team.linescores && team.linescores.period.map((period, index) => (
            <Cell
                dark={isDark ? 1 : undefined}
                key={`period-${period.peroid_value}-${index}`}
                winning={+period.score > +otherTeam.linescores.period[index].score ? 1 : undefined}
            >
                {period.score}
            </Cell>
        ))}
        <Cell dark={isDark ? 1 : undefined} winning={+team.score > +otherTeam.score ? 1 : undefined}>{team.score}</Cell>
    </Row>
)

class Summary extends React.PureComponent {
    render() {
        const { home, visitor, extra } = this.props
        return (
            <Wrapper>
                <ThemeConsumer>
                    {({ state: { dark } }) => (
                        <React.Fragment>
                            <StickyTable stickyHeaderCount={0}>
                                <Row>
                                    <RowHeaderCell> Team </RowHeaderCell>
                                    {home.linescores && home.linescores.period.map(period => (
                                    // TODO: hides the unstart peroid
                                        <HeaderCell key={`period-${period.period_value}`}> {period.period_name} </HeaderCell>
                                    ))}
                                    <HeaderCell> Final </HeaderCell>
                                </Row>
                                {renderTeamRow(visitor, home, dark)}
                                {renderTeamRow(home, visitor, dark, 1)}
                                <Row>
                                    <RowHeaderCell>Lead Changes</RowHeaderCell>
                                    <Cell>{extra.leadChanges}</Cell>
                                </Row>
                                <Row>
                                    <RowHeaderCell>Times Tied</RowHeaderCell>
                                    <Cell>{extra.timesTied}</Cell>
                                </Row>
                            </StickyTable>
                        </React.Fragment>

                    )}
                </ThemeConsumer>
            </Wrapper>
        )
    }
}

Summary.propTypes = {
    home: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    extra: PropTypes.shape({
        leadChanges: PropTypes.number.isRequired,
        timesTied: PropTypes.number.isRequired,
    }),
}


export default Summary
