import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table';
import { Cell, HeaderCell, RowHeaderCell } from '../../utils/format'
import { Flex } from '../../styles'

const Wrapper = styled.div`
    width: 100%;
`;

const renderTeamRow = (team, otherTeam) => (
    <Row>
        <RowHeaderCell>{team.name}</RowHeaderCell>
        {team.summary.map((period, index) => (
            <Cell
                key={`period-${period.value}`}
                winning={period.value > otherTeam.summary[index].value ? 1 : 0}
            >
                {period.score}
            </Cell>
        ))}
        <Cell winning={team.score > otherTeam.score ? 1 : 0}>{team.score}</Cell>
    </Row>
)

class Summary extends React.PureComponent {
    render() {
        const { home, visitor } = this.props
        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0}>
                    <Row>
                        <RowHeaderCell style={{borderTopLeftRadius: '5px'}}> Team </RowHeaderCell>
                        {home.summary.map((period, index) => (
                            <HeaderCell key={`peroid-${period.value}`}> {period.name} </HeaderCell>
                        ))}
                        <HeaderCell style={{borderTopRightRadius: '5px'}}> Final </HeaderCell>
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
