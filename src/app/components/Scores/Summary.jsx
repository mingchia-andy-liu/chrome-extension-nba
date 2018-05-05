import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table';
import { Cell, HeaderCell, RowHeaderCell } from '../../utils/format'

const Wrapper = styled.div`
    width: 100%;
`;

const renderTeamRow = (name, scores, otherSocres, final, otherFinal) => (
    <Row>
        <RowHeaderCell>{name}</RowHeaderCell>
        {scores.map((period, index) => (
            <Cell
                key={`period-${period.peroid}-${index}`}
                winning={period.score > otherSocres[index].score ? 1 : 0}
            >
                {period.score}
            </Cell>
        ))}
        <Cell winning={final > otherFinal ? 1 : 0}>{final}</Cell>
    </Row>
)

class Summary extends React.PureComponent {
    render() {
        const { hs, vs, htn, vtn, hss, vss } = this.props
        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0}>
                    <Row>
                        <RowHeaderCell style={{borderTopLeftRadius: '5px'}}> Team </RowHeaderCell>
                        {hs.map(period => (
                            // TODO: hides the unstart peroid
                            <HeaderCell key={`period-${period.period}`}> {period.period} </HeaderCell>
                        ))}
                        <HeaderCell style={{borderTopRightRadius: '5px'}}> Final </HeaderCell>
                    </Row>
                    {renderTeamRow(htn, hs, vs, hss, vss)}
                    {renderTeamRow(vtn, vs, hs, vss, hss)}
                </StickyTable>
            </Wrapper>
        )
    }
}

Summary.propTypes = {
    htn: PropTypes.string.isRequired,
    vtn: PropTypes.string.isRequired,
    hss: PropTypes.number.isRequired,
    vss: PropTypes.number.isRequired,
    hs: PropTypes.arrayOf(PropTypes.object).isRequired,
    vs: PropTypes.arrayOf(PropTypes.object).isRequired,
}


export default Summary
