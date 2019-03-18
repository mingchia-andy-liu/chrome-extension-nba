import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { ThemeConsumer } from '../Context'
import { Cell, HeaderCell } from '../../utils/format'
import { getOddRowColor } from '../../utils/common'
import { QUARTER_NAMES } from '../../utils/constant'
import { RowCSS } from '../../styles'
import { getLogoColorByName } from '../../utils/teams'

const Wrapper = styled.div`
    width: 100%;
`

const Title = styled.div`
    ${RowCSS}
    padding: 5px 0;
`

const Hint = styled.div`
    padding: 0 5px;
    color: white;
    background-color:${(props) => props.backgroundColor};

    &:not(:first-child) {
        margin: 0 5px;
    }
`

const QtrBtn = styled.a`
    padding: 0 10px;
    cursor: pointer;
    ${props => props.selected && 'background-color: #046fdb; color: white;'}
`

const ScoreCell = styled(Cell)`
    background-color: ${(props) => (props.changes && '#1b5e20') || (props.tied && '#7c4dff')};
    color: ${(props) => (props.changes || props.tied) && 'white'};
`

const renderHeaderRow = () => (
    <Row>
        <HeaderCell style={{padding: '0 3vw'}}>{'Clock'}</HeaderCell>
        <HeaderCell style={{padding: '0 3vw'}}>{'Team'}</HeaderCell>
        <HeaderCell style={{padding: '0 3vw'}}>{'Score'}</HeaderCell>
        <HeaderCell style={{width: '100%'}}>{'Play'}</HeaderCell>
    </Row>
)

const renderPBPRow = (plays, period, isDark) => {
    if (plays && plays.length === 0) {
        return <Row> <Cell> No Data Avaiable </Cell> </Row>
    }
    const filtered = plays.filter(play => +play.period === period).reverse()

    return filtered.map((play, i) => {
        const {
            clock,
            team_abr,
            home_score,
            visitor_score,
            changes,
            description: _description,
        } = play
        const index = _description.indexOf(']')
        const color = getLogoColorByName(team_abr)
        const LOGO = index !== -1
            ? <Cell style={{color: 'white', backgroundColor: color}}>{team_abr}</Cell>
            : <Cell></Cell>
        const SCORE = index > 4
            ? <ScoreCell changes={changes ? 1 : undefined} tied={home_score === visitor_score ? 1 : undefined}>{_description.substring(5, index)}</ScoreCell>
            : <Cell></Cell>

        const description = _description.replace(/\[.*\]/i, '').trim()

        return (
            <Row key={`pbp-${period}-${i}`} style={{backgroundColor: getOddRowColor(i, isDark)}}>
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
                    {QUARTER_NAMES[i]}
                </QtrBtn>
            )
        }

        return (
            <Title> {Btns} </Title>
        )
    }

    render() {
        const { pbp: { play } } = this.props
        const { quarter, currentQuarter } = this.state

        return (
            <Wrapper>
                {this.renderQuarters(quarter, currentQuarter)}
                <Title>
                    <Hint backgroundColor={'#1b5e20'}>Lead Changes</Hint>
                    <Hint backgroundColor={'#7c4dff'}>Tied</Hint>
                </Title>
                <ThemeConsumer>
                    {({state: {dark}}) => (
                        <StickyTable stickyHeaderCount={0} stickyColumnCount={0}>
                            {renderHeaderRow()}
                            {renderPBPRow(play, currentQuarter, dark)}
                        </StickyTable>
                    )}
                </ThemeConsumer>
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
