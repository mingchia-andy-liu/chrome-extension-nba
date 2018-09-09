import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { Cell, HeaderCell, quarterNames } from '../../utils/format'
import { RowCSS } from '../../styles'
import { getLogoColorByName } from '../../utils/teams'

const Wrapper = styled.div`
    width: 100%;
`
const Qtr = styled.div`
    ${RowCSS}
    padding: 10px 0;
`

const QtrBtn = styled.a`
    padding: 0 10px;
    cursor: pointer;
    ${props => props.selected && 'background-color: #046fdb; color: white;'}
`

const renderHeaderRow = () => (
    <Row>
        <HeaderCell style={{padding: '0 3vw'}}>{'Clock'}</HeaderCell>
        <HeaderCell style={{padding: '0 3vw'}}>{'Team'}</HeaderCell>
        <HeaderCell style={{padding: '0 3vw'}}>{'Score'}</HeaderCell>
        <HeaderCell style={{width: '100%'}}>{'Play'}</HeaderCell>
    </Row>
)

const renderPBPRow = (plays, period) => {
    if (plays && plays.length === 0) {
        return <Row> <Cell> No Data Avaiable </Cell> </Row>
    }
    const filtered = plays.filter(play => +play.period === period).reverse()

    return filtered.map((play, i) => {
        const {
            clock,
            description: _description,
        } = play
        const index = _description.indexOf(']')
        const name = index === -1 ? '' : _description.substring(1, 4)
        const color = getLogoColorByName(name)
        const LOGO = index !== -1
            ? <Cell style={{color: 'white', backgroundColor: color}}>{name}</Cell>
            : <Cell></Cell>
        const SCORE = index > 4
            ? <Cell>{_description.substring(5, index)}</Cell>
            : <Cell></Cell>

        const description = _description.replace(/\[.*\]/i, '').trim()

        return (
            <Row key={`pbp-${period}-${i}`}>
                <Cell> {clock} </Cell>
                {LOGO}
                {SCORE}
                <Cell style={{ textAlign: 'left' }}> {description} </Cell>
            </Row>
        )
    })
}

class PlayByPlay extends React.PureComponent {
    constructor(props) {
        super(props)

        const { pbp: { play } } = this.props
        const quarter = play && play.length !== 0
            ? +play[play.length - 1].period
            : -1
        this.state = {
            quarter,
            currentQuarter: quarter,
        }
    }

    renderQuarters(quarter, currentQuarter) {
        const Btns = []
        for(let i = 0; i < quarter; i++) {
            Btns.push(
                <QtrBtn
                    key={`qtr-${i}`}
                    selected={i+1 === currentQuarter}
                    onClick={()=> {
                        this.setState({
                            currentQuarter: i+1,
                        })
                    }}
                >
                    {quarterNames[i]}
                </QtrBtn>
            )
        }

        return (
            <Qtr> {Btns} </Qtr>
        )
    }

    render() {
        const { pbp: { play } } = this.props
        const { quarter, currentQuarter } = this.state

        return (
            <Wrapper>
                {this.renderQuarters(quarter, currentQuarter)}
                <StickyTable stickyHeaderCount={0} stickyColumnCount={0}>
                    {renderHeaderRow()}
                    {renderPBPRow(play, currentQuarter)}
                </StickyTable>
            </Wrapper>
        )
    }
}

PlayByPlay.propTypes = {
    pbp: PropTypes.shape({
        play: PropTypes.array.isRequired,
    }).isRequired,
}


export default PlayByPlay
