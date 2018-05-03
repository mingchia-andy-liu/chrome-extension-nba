import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row as StickyRow } from 'react-sticky-table'
import { Cell, HeaderCell } from '../../utils/format'

const Wrapper = styled.div`
    width: 100%;
`;

const Table = styled(StickyTable)`
    width: 100%;
`;

const Row = styled(StickyRow)`
    width: 100%;
`;

const renderPBPRow = (play, i) => {
    const index = play.de.indexOf(']')
    const name = play.etype < 1 || play.etype > 9 ? '' : play.de.substring(1, 4)
    const color = getLogoColor(name)
    const score = play.de.substring(5, index)
    const LOGO = index === -1
        ? <Cell style={`color: white;background-color:${color}`}>{name}</Cell>
        : <Cell></Cell>
    const SCORE = index > 4
        ? <Cell>{play.de.substring(5, index)}</Cell>
        : <Cell></Cell>

    const description = play.de.replace(/\[.*\]/i, '').trim()

    return (
        <Row key={`pbp-${i}`}>
            <Cell> {play.cl} </Cell>
            {LOGO}
            {SCORE}
            <Cell> {description} </Cell>
        </Row>
    )
}

class PlayByPlay extends React.PureComponent {
    render() {
        return (
            <div style={{width: '100%', height: '400px'}}>
                <Table stickyHeaderCount={0} stickyColumnCount={0}>
                    {this.props.pbp.map((element, index) => (
                        renderPBPRow(element, index)
                    ))}
                </Table>
            </div>
        )
    }
}

PlayByPlay.propTypes = {
    pbp: PropTypes.array.isRequired
}


export default PlayByPlay
