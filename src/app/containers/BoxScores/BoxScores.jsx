import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment-timezone'
import CardList from '../../components/CardList'
import DatePicker from '../../containers/DatePicker'
import {
    PlayByPlay,
    Summary,
    PlayerStats,
    TeamStats,
    AdvancedTeamStats
} from '../../components/Scores'
import TeamInfo from '../../components/TeamInfo'
import Overlay from '../../components/Overlay'
import Loader from '../../components/Loader'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import { Shadow, Row } from '../../styles'
import { isWinning } from '../../utils/format'
import getAPIDate from '../../utils/getApiDate'
import { fetchLiveGameBox, resetLiveGameBox } from './actions'
import { fetchGames } from '../Popup/actions'

import './alarm'

const Wrapper = styled.div`
    display: grid;
    grid-template-areas: "sidebar content";
    grid-template-columns: minmax(27%, 300px) 1fr;
    grid-gap: 1em 1em;
    padding: 10px 0;
`

const Sidebar = styled.div`
    grid-area: sidebar;
`
const Content = styled.div`
    ${Shadow}
    grid-area: content;
    background-color: #fff;
    overflow-y: scroll !important;
    padding: 10px;
    border-radius: 5px;
`

const Title = styled(Row)`
    font-size: calc(12px + 1vw);
`

const StyledTitleItem = styled.div`
    padding: 0 10px;
    ${props => !props.winning && 'opacity:0.5;'};
`

const StyledScore= styled(StyledTitleItem)`
    padding: 0 10px;
    ${(props) => (props.winning ? 'color: green;' : 'opacity:0.5;')};
`

class BoxScores extends React.Component {
    constructor(props) {
        super(props)

        const {
            match : {params : { id } },
            date: {
                date,
                isDirty,
            },
        } = this.props
        let dateStr = isDirty
            ? moment(date).format('YYYYMMDD')
            : getAPIDate().format('YYYYMMDD')

        const queryString = require('query-string')
        const { date: queryDate } = queryString.parse(this.props.location.search)
        if (queryDate) {
            dateStr = queryDate
        }

        this.state = {
            id: id ? id : '0',
            quarter: 0,
            date: dateStr,
        }
    }

    componentDidMount() {
        const { date, id } = this.state
        this.props.fetchGames(date, (games) => {
            let found = false
            games.forEach(({ id: gid }) => {
                if (gid === id) {
                    this.props.fetchLiveGameBox(date, this.state.id)
                    found = true
                }
            })
            if (!found) this.props.history.replace('/boxscores')
        })
    }

    renderTitle(bsData) {
        const {
            home: {
                abbreviation: hta,
                nickname: htn,
                score: hs,
            },
            visitor: {
                abbreviation: vta,
                nickname: vtn,
                score: vs,
            },
        } = bsData
        return (
            <Title>
                <TeamInfo ta={vta} tn={vtn}  winning={isWinning(vs, hs)}/>
                <StyledScore winning={isWinning(vs, hs)}> {vs} </StyledScore>
                -
                <StyledScore winning={isWinning(hs, vs)}> {hs} </StyledScore>
                <TeamInfo ta={hta} tn={htn}  winning={isWinning(hs, vs)}/>
            </Title>
        )
    }

    renderSummary(bsData) {
        const {
            home,
            visitor,
        } = bsData
        return <Summary home={home} visitor={visitor}/>
    }

    renderTeamStats(bsData) {
        const {
            home: {
                abbreviation: hta,
                stats: hts,
            },
            visitor: {
                abbreviation: vta,
                stats: vts,
            },
        } = bsData
        return <TeamStats hta={hta} hts={hts || {}} vta={vta} vts={vts || {}} />
    }

    renderAdvancedTeamStats(teamStats, bsData) {
        const {
            home,
            visitor,
            extra,
        } = teamStats

        const {
            home: {
                abbreviation: hta,
            },
            visitor: {
                abbreviation: vta,
            },
        } = bsData

        return (
            <AdvancedTeamStats
                home={home}
                hta={hta}
                visitor={visitor}
                vta={vta}
                extra={extra}
            />
        )
    }

    renderPlyaerStats(bsData) {
        const {
            home: {
                abbreviation: hta,
                players: { player: homePlayers },
            },
            visitor: {
                abbreviation: vta,
                players: { player: visitorPlayers },
            },
        } = bsData

        return <PlayerStats hta={hta} hps={homePlayers || []} vta={vta} vps={visitorPlayers || []} />
    }

    renderPlaybyPlay(pbpData) {
        return <PlayByPlay pbp={pbpData} />
    }

    renderContent() {
        const { bs: { bsData, pbpData, team } } = this.props
        const isEmpty = Object.keys(bsData).length === 0 || Object.keys(pbpData).length === 0
        // Route expects a funciton for component prop
        const contentComponent =  () => (
            <React.Fragment>
                {!isEmpty && this.renderTitle(bsData)}
                <h3>Summary</h3>
                {!isEmpty && this.renderSummary(bsData)}
                <h3>Team Stats</h3>
                {!isEmpty && this.renderTeamStats(bsData)}
                <h4>Advanced</h4>
                {!isEmpty && this.renderAdvancedTeamStats(team, bsData)}
                <h3>Player Stats</h3>
                {!isEmpty && this.renderPlyaerStats(bsData)}
                <h3>Play By Play</h3>
                {!isEmpty && this.renderPlaybyPlay(pbpData)}
            </React.Fragment>
        )

        return (
            <Switch>
                <Route path="/boxscores/:id" component={ contentComponent } />
                <Route path="/boxscores" component={ Overlay } />
            </Switch>
        )
    }

    selectGame(e) {
        const id = e.currentTarget.dataset.id
        const { date } = this.state
        const { location: { pathname } } = this.props
        this.props.fetchLiveGameBox(date, id)
        if (pathname.startsWith('/boxscores')) {
            this.props.history.replace(`/boxscores/${id}`)
        } else {
            this.props.history.push(`/boxscores/${id}`)
        }

        this.setState({ id })
    }

    render() {
        const {
            live,
            bs,
        } = this.props

        return (
            <Layout>
                <Layout.Header>{<Header index={0}/>}</Layout.Header>
                <Layout.Content>
                    <Wrapper>
                        <Sidebar>
                            <DatePicker onChange={(date) => {
                                this.setState({
                                    id: '0',
                                    date,
                                })
                                this.props.resetLiveGameBox()
                                this.props.history.replace('/boxscores')
                            }}
                            />
                            <CardList
                                isLoading={live.isLoading}
                                games={live.games}
                                onClick={this.selectGame.bind(this)}
                                selected={this.state.id}
                            />
                        </Sidebar>
                        <Content>
                            {bs.isLoading
                                ? <Loader />
                                : this.renderContent()
                            }
                        </Content>
                    </Wrapper>
                </Layout.Content>
            </Layout>
        )
    }
}

BoxScores.propTypes = {
    live: PropTypes.object,
    bs: PropTypes.shape({
        bsData: PropTypes.object.isRequired,
        pbpData: PropTypes.object.isRequired,
    }),
    date: PropTypes.shape({
        date: PropTypes.object.isRequired,
        isDirty: PropTypes.bool.isRequired,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string.isRequired,
    }),
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    fetchLiveGameBox: PropTypes.func.isRequired,
    fetchGames: PropTypes.func.isRequired,
    resetLiveGameBox: PropTypes.func.isRequired,
}

const mapStateToProps = ({ live, bs, date }) => ({
    live,
    bs,
    date,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchLiveGameBox,
        fetchGames,
        resetLiveGameBox,
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BoxScores))
