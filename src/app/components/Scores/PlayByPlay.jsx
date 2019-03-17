import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StickyTable, Row } from 'react-sticky-table'
import { ThemeConsumer } from '../Context'
import { Cell, HeaderCell } from '../../utils/format'
import { getOddRowColor } from '../../utils/common'
import { QUARTER_NAMES } from '../../utils/constant'
import { RowCSS, Theme } from '../../styles'
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

const ShowMoreButton = styled.button`
    color: ${(props) => (props.dark ? Theme.dark.color : Theme.light.color)};
    border-radius: 4px;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    font-size: calc(14px + 0.1vw);
    background-color: ${(props) => (props.dark ? Theme.dark.blockBackground : Theme.light.blockBackground)};
    margin: 10px 0;
    width: 100%;
`

const renderHeaderRow = () => (
    <Row>
        <HeaderCell style={{padding: '0 3vw'}}>{'Clock'}</HeaderCell>
        <HeaderCell style={{padding: '0 3vw'}}>{'Team'}</HeaderCell>
        <HeaderCell style={{padding: '0 3vw'}}>{'Score'}</HeaderCell>
        <HeaderCell style={{width: '100%'}}>{'Play'}</HeaderCell>
    </Row>
)

const renderPBPRow = (plays, isDark) => {
    if (plays && plays.length === 0) {
        return <Row> <Cell> No Data Avaiable </Cell> </Row>
    }

    return plays.map((play, i) => {
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
            <Row key={`pbp-${i}`} style={{backgroundColor: getOddRowColor(i, isDark)}}>
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
            page: 1,
        }
    }

    renderQuarters(quarter, currentQuarter) {
        const btns = []
        for(let i = 0; i < quarter; i++) {
            btns.push(
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
            <Title> {btns} </Title>
        )
    }

    showMore = () => {
        this.setState({
            page: this.state.page + 1,
        })
    }

    render() {
        const { pbp: { play } } = this.props
        const { quarter, currentQuarter, page } = this.state

        const filtered = play.filter(play => +play.period === currentQuarter).reverse()
        const sliced = filtered.slice(0, page * 15)

        const showButton = sliced.length !== filtered.length

        return (
            <Wrapper>
                {this.renderQuarters(quarter, currentQuarter)}
                <Title>
                    <Hint backgroundColor={'#1b5e20'}>Lead Changes</Hint>
                    <Hint backgroundColor={'#7c4dff'}>Tied</Hint>
                </Title>
                <ThemeConsumer>
                    {({state: {dark}}) => (
                        <React.Fragment>
                            <StickyTable stickyHeaderCount={0} stickyColumnCount={0}>
                                {renderHeaderRow()}
                                {renderPBPRow(sliced, dark)}
                            </StickyTable>
                            {showButton && <ShowMoreButton onClick={this.showMore} dark={dark}>Show more plays</ShowMoreButton>}
                        </React.Fragment>
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
