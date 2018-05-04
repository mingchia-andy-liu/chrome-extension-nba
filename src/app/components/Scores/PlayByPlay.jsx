import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell } from '../../utils/format'
import { getLogoColor } from '../../utils/logo'

const Wrapper = styled.div`
    width: 100%;
`

const renderHeaderRow = () => (
    <Row>
        <HeaderCell>{'Clock'}</HeaderCell>
        <HeaderCell>{'Team'}</HeaderCell>
        <HeaderCell>{'Score'}</HeaderCell>
        <HeaderCell>{'Play'}</HeaderCell>
    </Row>
)

const renderPBPRow = (plays, peroid) => {
    return plays.map((play, i) => {
        const index = play.de.indexOf(']')
        const name = play.etype < 1 || play.etype > 9 ? '' : play.de.substring(1, 4)
        const color = getLogoColor(name)
        const LOGO = index !== -1
            ? <Cell style={{color: 'white', backgroundColor: color}}>{name}</Cell>
            : <Cell></Cell>
        const SCORE = index > 4
            ? <Cell>{play.de.substring(5, index)}</Cell>
            : <Cell></Cell>

        const description = play.de.replace(/\[.*\]/i, '').trim()

        return (
            <Row key={`pbp-${peroid}-${i}`}>
                <Cell> {play.cl} </Cell>
                {LOGO}
                {SCORE}
                <Cell style={{ textAlign: 'left' }}> {description} </Cell>
            </Row>
        )
    })
}

class PlayByPlay extends React.PureComponent {
    render() {
        const { pbp, quarter } = this.props
        return (
            <Wrapper>
                <StickyTable stickyHeaderCount={0} stickyColumnCount={0}>
                    {renderHeaderRow()}
                    {renderPBPRow(pbp[quarter].pla, quarter)}
                </StickyTable>
            </Wrapper>
        )
    }
}

PlayByPlay.propTypes = {
    pbp: PropTypes.array.isRequired,
    quarter: PropTypes.number.isRequired,
}


export default PlayByPlay
