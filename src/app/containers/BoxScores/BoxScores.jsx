import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import CardList from '../../components/CardList'
import DatePicker from '../../containers/DatePicker'
import Overlay from '../../components/Overlay'
import Loader from '../../components/Loader'
import Layout from '../../components/Layout'
import Header from '../../components/Header'
import { DarkModeCheckbox, NoSpoilerCheckbox, BroadcastCheckbox } from '../../components/Checkbox'
import { SettingsConsumer, ThemeConsumer } from '../../components/Context'
import { ButtonsWrapper } from '../../styles'
import { DATE_FORMAT } from '../../utils/constant'
import { fetchLiveGameBoxIfNeeded, resetLiveGameBox } from './actions'
import { fetchGamesIfNeeded } from '../Popup/actions'
import { dispatchChangeDate } from '../DatePicker/actions'
import {
    Content,
    Sidebar,
    Wrapper
} from './styles'
import {
    renderTitle,
    renderSummary,
    renderHints,
    renderPlayerStats,
    renderTeamStats,
    renderAdvancedTeamStats,
    renderPlaybyPlay
} from './helpers'


class BoxScores extends React.Component {
    constructor(props) {
        super(props)

        const {
            match : { params : { id } },
            date: { date },
        } = this.props
        let dateStr = moment(date).format(DATE_FORMAT)

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
        // TODO: when sync store, read the proper date from the localStorage
        this.props.dispatchChangeDate(moment(date, DATE_FORMAT).toDate())
        this.props.fetchGamesIfNeeded(date, (games) => {
            const found = games.find(({ id: gid }) => gid === id)
            if (found) {
                this.props.fetchLiveGameBoxIfNeeded(date, this.state.id)
                this.props.history.replace(`/boxscores/${id}`)
            } else {
                this.props.history.replace('/boxscores')
            }
        }, true)
        document.title = 'Box Scores | Box-scores'
    }

    componentWillUnmount() {
        this.props.resetLiveGameBox()
    }

    renderContent(spoiler, dark) {
        const { bs: { bsData, pbpData, teamStats } } = this.props
        // Route expects a function for component prop
        const contentComponent = () => {
            if (
                !bsData ||
                Object.keys(bsData).length === 0 ||
                (bsData.periodTime && bsData.periodTime.gameStatus === '1')
            ) {
                return <Overlay text={'Game has not started'} />
            } else {
                if (spoiler) {
                    return (
                        <Overlay text="Turn off no spoiler">
                            <NoSpoilerCheckbox />
                        </Overlay>
                    )
                }
                return (
                    <React.Fragment>
                        {renderTitle(bsData)}
                        <h3>Summary</h3>
                        {renderSummary(bsData)}
                        <h3>Player Stats</h3>
                        {renderHints(dark)}
                        {renderPlayerStats(bsData)}
                        <h3>Team Stats</h3>
                        {renderTeamStats(bsData)}
                        <h4>Advanced</h4>
                        {renderAdvancedTeamStats(teamStats, bsData)}
                        <h3>Play By Play</h3>
                        {renderPlaybyPlay(pbpData)}
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
        this.props.fetchLiveGameBoxIfNeeded(date, id)
        if (pathname.startsWith('/boxscores')) {
            this.props.history.replace(`/boxscores/${id}`)
        } else {
            this.props.history.push(`/boxscores/${id}`)
        }

        this.setState({ id })
    }

    render() {
        const { live, bs } = this.props
        const { date } = this.state
        return (
            <Layout>
                <Layout.Header>{<Header index={0}/>}</Layout.Header>
                <Layout.Content>
                    <Wrapper>
                        <Sidebar>
                            <DatePicker
                                startDate={date}
                                onChange={(date) => {
                                    this.setState({
                                        id: '0',
                                        date,
                                    })
                                    this.props.resetLiveGameBox()
                                    this.props.history.replace('/boxscores')
                                }}
                            />
                            <ButtonsWrapper>
                                <DarkModeCheckbox />
                                <NoSpoilerCheckbox />
                                <BroadcastCheckbox />
                            </ButtonsWrapper>
                            <CardList
                                isLoading={live.isLoading}
                                games={live.games}
                                onClick={this.selectGame.bind(this)}
                                selected={this.state.id}
                            />
                        </Sidebar>
                        <ThemeConsumer>
                            {({state: { dark }}) =>(
                                <SettingsConsumer>
                                    {({ state: {spoiler} }) => (
                                        <Content dark={dark}>
                                            {bs.isLoading
                                                ? <Loader />
                                                : this.renderContent(spoiler, dark)
                                            }
                                        </Content>
                                    )}
                                </SettingsConsumer>
                            )}
                        </ThemeConsumer>
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
    fetchLiveGameBoxIfNeeded: PropTypes.func.isRequired,
    fetchGamesIfNeeded: PropTypes.func.isRequired,
    resetLiveGameBox: PropTypes.func.isRequired,
    dispatchChangeDate: PropTypes.func.isRequired,
}

const mapStateToProps = ({ live, bs, date }) => ({
    live,
    bs,
    date,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchLiveGameBoxIfNeeded,
        fetchGamesIfNeeded,
        resetLiveGameBox,
        dispatchChangeDate,
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BoxScores))
