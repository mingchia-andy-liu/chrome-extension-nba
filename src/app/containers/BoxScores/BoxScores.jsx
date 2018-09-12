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
import { SettingsConsumer } from '../../components/Context'
import { Shadow, Theme, Row, Column, mediaQuery } from '../../styles'
import { isWinning } from '../../utils/format'
import { fetchLiveGameBox, resetLiveGameBox } from './actions'
import { fetchGames } from '../Popup/actions'


const Wrapper = styled.div`
    display: grid;
    grid-template-areas: "sidebar content";
    grid-template-columns: minmax(27%, 300px) 1fr;
    grid-gap: 1em 1em;
    padding: 10px 0;

    ${mediaQuery`
        grid-template-areas:"sidebar"
                            "content";
        grid-template-columns: 1fr;`}
`

const Sidebar = styled.div`
    grid-area: sidebar;
`
const Content = styled.div`
    ${Shadow}
    grid-area: content;
    overflow-y: scroll !important;
    padding: 10px;
    border-radius: 5px;
    background-color: ${(props) => (props.dark ? Theme.dark.blockBackground : '#fff')};
`

const Title = styled(Row)`
    font-size: calc(12px + 1vw);
`

const StyledScore = styled.div`
    padding: 0 10px;
    color: ${(props) => {
        if (props.dark && props.winning) return Theme.dark.winning
        if (props.winning) return Theme.light.winning
    }};
    ${(props) => (props.winning ? '' : 'opacity: 0.5')};
`

const Subtitle = styled.span`
    padding: 0 5px;

    &:first-child {
        padding-left: 0px;
    }
`

class BoxScores extends React.Component {
    constructor(props) {
        super(props)

        const {
            match : { params : { id } },
            date: { date },
        } = this.props
        let dateStr = moment(date).format('YYYYMMDD')

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
            <SettingsConsumer>
                {({state: { dark }}) => (
                    <Title justifyCenter={true} alignCenter={true}>
                        <TeamInfo ta={vta} tn={vtn}  winning={isWinning(vs, hs)}/>
                        <StyledScore dark={dark} winning={isWinning(vs, hs)}> {vs} </StyledScore>
                        -
                        <StyledScore dark={dark} winning={isWinning(hs, vs)}> {hs} </StyledScore>
                        <TeamInfo ta={hta} tn={htn}  winning={isWinning(hs, vs)}/>
                    </Title>
                )}
            </SettingsConsumer>
        )
    }

    renderSummary(bsData) {
        const {
            officials,
            home,
            visitor,
        } = bsData
        return (
            <Column>
                <Row>
                    <Subtitle>OFFICIALS: </Subtitle>
                    {officials.map(({person_id, first_name, last_name}, i) =>
                        <Subtitle key={person_id}>{first_name} {last_name}{i !== officials.length - 1 && ','}</Subtitle>
                    )}
                </Row>
                <Summary home={home} visitor={visitor}/>
            </Column>
        )
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
        const { bs: { bsData, pbpData, teamStats } } = this.props
        // Route expects a funciton for component prop
        const contentComponent = () => {
            if (!bsData || Object.keys(bsData).length === 0 || !bsData.st === 1) {
                return <Overlay text={'Game has not started'} />
            } else {
                return (
                    <React.Fragment>
                        {this.renderTitle(bsData)}
                        <h3>Summary</h3>
                        {this.renderSummary(bsData)}
                        <h3>Team Stats</h3>
                        {this.renderTeamStats(bsData)}
                        <h4>Advanced</h4>
                        {this.renderAdvancedTeamStats(teamStats, bsData)}
                        <h3>Player Stats</h3>
                        {this.renderPlyaerStats(bsData)}
                        <h3>Play By Play</h3>
                        {this.renderPlaybyPlay(pbpData)}
                    </React.Fragment>
                )
            }
        }

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
                        <SettingsConsumer>
                            {({ state: { dark } }) => (
                                <Content dark={dark}>
                                    {bs.isLoading
                                        ? <Loader />
                                        : this.renderContent()
                                    }
                                </Content>
                            )}
                        </SettingsConsumer>
                    </Wrapper>
                </Layout.Content>
            </Layout>
        )
    }
}

BoxScores.propTypes = {
    live: PropTypes.object,
    bs: PropTypes.shape({
        isLoading: PropTypes.bool.isRequired,
        bsData: PropTypes.object.isRequired,
        pbpData: PropTypes.object.isRequired,
        teamStats: PropTypes.object.isRequired,
    }),
    date: PropTypes.shape({
        date: PropTypes.object.isRequired,
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
