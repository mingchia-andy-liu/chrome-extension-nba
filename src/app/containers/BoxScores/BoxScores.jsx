import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import CardList from '../../components/CardList'
import DatePicker from '../../containers/DatePicker'
import { Tab, TabItem } from '../../components/Tab'
import { PlayByPlay, Summary, PlayerStats } from '../../components/Scores'
import { Shadow, RowCSS } from '../../styles'
import * as actions from './actions'

const Wrapper = styled.div`
    display: grid;
    grid-template-areas:    "header header"
                            "cards content";
    grid-template-rows: 50px 1fr;
    grid-template-columns: minmax(27%, 300px) 1fr;
    grid-gap: 1em 1em;
    padding: 0 10px;
`
const NavBar = styled.div`
    grid-area:    header;
    background-color: red;
`
const Cards = styled.div`
    grid-area: cards;
`
const Content = styled.div`
    ${Shadow}
    grid-area: content;
    background-color: #fff;
    overflow-y: scroll !important;
    padding: 10px;
    border-radius: 5px;
`

const Qtr = styled.div`
    ${RowCSS}
`

const QtrBtn = styled.a`
    padding: 0 10px;
    cursor: pointer;
    ${props => props.selected && 'background-color: blue; color: white;'}
`

const quarters = ['Q1', 'Q2', 'Q3','Q4', 'OT1', 'OT2', 'OT3', 'OT4', 'OT5', 'OT6', 'OT7', 'OT8', 'OT9', 'OT10' ]

class BoxScores extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            gid: '0',
            quarter: 0,
        }
    }

    componentDidMount() {
        this.props.live.games.forEach(({ gid }) => {
            this.props.fetchPlayByPlay(gid)
            this.props.fetchLiveGameBox(gid)
        })
    }

    renderSummary() {
        const {bs} = this.props
        const { gid } = this.state
        if (Object.keys(bs.gameDetails).length !== 0) {
            if (bs.gameDetails[gid] &&
                bs.gameDetails[gid].bs) {
                const { hs, vs, htn, vtn, hss, vss } = bs.gameDetails[gid].bs
                return <Summary hs={hs} vs={vs} htn={htn} vtn={vtn} vss={vss} hss={hss}/>
            }
        }
    }

    renderBoxScores() {
        const { bs } = this.props
        const { gid } = this.state
        if (Object.keys(bs.gameDetails).length !== 0 &&
            bs.gameDetails[gid] &&
            bs.gameDetails[gid].bs) {
            const { hpstsg, vpstsg } = bs.gameDetails[gid].bs
            return <PlayerStats hpstsg={hpstsg} vpstsg={vpstsg} />
        }
    }

    renderPlaybyPlay() {
        const { bs } = this.props
        const { gid, quarter } = this.state
        if (Object.keys(bs.gameDetails).length !== 0 &&
            bs.gameDetails[gid] &&
            bs.gameDetails[gid].pd) {
            return <PlayByPlay pbp={bs.gameDetails[gid].pd} quarter={quarter} />
        }
    }

    renderQuarters() {
        return (
            <Qtr>
                {quarters.map((q, i) => (
                    <QtrBtn
                        key={`qtr-${q}`}
                        selected={i === this.state.quarter}
                        onClick={()=> {
                            this.setState({ quarter: i })
                        }}
                    >
                        {q}
                    </QtrBtn>
                ))}
            </Qtr>
        )
    }

    selecteGame(e) {
        this.setState({
            gid: e.currentTarget.dataset.gid,
        })
    }

    render() {
        const { live, bs } = this.props
        if (bs.isLoading || live.isLoading) {
            return (
                <div>Loading...</div>
            )
        }
        return (
            <Wrapper>
                <NavBar>
                    <Tab startIndex={0}>
                        <TabItem to="/" label="Options"/>
                        <TabItem to="/" label="Standings"/>
                        <TabItem to="/" label="Playoff"/>
                    </Tab>
                </NavBar>
                <Cards>
                    <DatePicker />
                    <CardList games={live.games} onClick={this.selecteGame.bind(this)}/>
                </Cards>
                <Content>
                    <h3>Summary</h3>
                    {this.renderSummary()}
                    <h3>Player Stats</h3>
                    {this.renderBoxScores()}
                    <h3>Play By Play</h3>
                    {this.renderQuarters()}
                    {this.renderPlaybyPlay()}
                </Content>
            </Wrapper>
        )
    }
}

const mapStateToProps = ({ live, bs }) => ({
    live,
    bs,
})

export default connect(mapStateToProps, actions)(BoxScores)
