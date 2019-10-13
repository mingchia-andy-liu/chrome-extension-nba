import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import Overlay from '../../components/Overlay'
import Loader from '../../components/Loader'
import { Tab, TabItem } from '../../components/Tab'
import { NoSpoilerCheckbox } from '../../components/Checkbox'
import { SettingsConsumer, ThemeConsumer } from '../../components/Context'
import { fetchLiveGameBoxIfNeeded, resetLiveGameBox, fetchGameHighlightIfNeeded } from './actions'
import { dispatchChangeDate } from '../DatePicker/actions'
import { Content, RowWrap } from './styles'
import {
    renderTitle,
    renderSummary,
    renderHints,
    renderPlayerStats,
    renderTeamStats,
    renderAdvancedTeamStats,
    renderPlaybyPlay,
    renderHighlightButton,
    renderTeamLeader
} from './helpers'
import modalType from '../Modal/modal-types'
import { toggleModal } from '../Modal/actions'
import { DATE_FORMAT } from '../../utils/constant'

class BoxScoresDetails extends React.Component {
    static propTypes = {
        bs: PropTypes.shape({
            isLoading: PropTypes.bool.isRequired,
            bsData: PropTypes.object.isRequired,
            pbpData: PropTypes.object.isRequired,
            teamStats: PropTypes.object.isRequired,
            urls: PropTypes.object.isRequired,
        }),

        fetchLiveGameBoxIfNeeded: PropTypes.func.isRequired,
        resetLiveGameBox: PropTypes.func.isRequired,
        dispatchChangeDate: PropTypes.func.isRequired,
        toggleModal: PropTypes.func.isRequired,
        fetchGameHighlightIfNeeded: PropTypes.func.isRequired,

        id: PropTypes.string.isRequired,
        date: PropTypes.object.isRequired,
    }

    constructor() {
        super()
        // tab index: 0: overview 1: boxscores 2: playbyplay
        this.state = { tabIndex: 1 }
    }

    clickHighlight = () => {
        const { bs: { urls } } = this.props
        const id = this.getIdFromProps()
        const url = urls[id]
        this.props.toggleModal({
            modalType: modalType.HIGHLIGH_VIDEO,
            src: `https://youtube.com/embed/${url}`,
        })
    }

    getIdFromProps = () => {
        return this.props.id || ''
    }

    componentDidMount() {
        const {date} = this.props
        const id = this.getIdFromProps()
        const dateStr = moment(date).format(DATE_FORMAT)
        this.props.fetchLiveGameBoxIfNeeded(dateStr, id, false).then(() => {
            this.props.fetchGameHighlightIfNeeded(id)
        })
    }

    componentWillUnmount() {
        this.props.resetLiveGameBox()
    }

    updateTabIndex = (index) => {
        this.setState({
            tabIndex: index,
        })
    }

    renderContent(spoiler, dark) {
        const { bs: { bsData, pbpData, teamStats, urls } } = this.props
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
                const id = this.getIdFromProps()
                const url = urls[id]
                return (
                    <React.Fragment>
                        <Tab onTabSelect={this.updateTabIndex} index={this.state.tabIndex} isLink={false}>
                            <TabItem label="Match up" />
                            <TabItem label="Box-scores" />
                            <TabItem label="Play-by-Play" />
                        </Tab>
                        <br />
                        {
                            this.state.tabIndex === 0 &&
                            <React.Fragment>
                                {renderTitle(bsData)}
                                <RowWrap>
                                    {renderHighlightButton(url, dark, this.clickHighlight)}
                                    {renderSummary(bsData, teamStats)}
                                </RowWrap>
                                {bsData.periodTime && bsData.periodTime.gameStatus === '3' && renderTeamLeader(bsData)}
                                <h3>Team Stats</h3>
                                {renderTeamStats(bsData)}
                                <h4>Advanced</h4>
                                {renderAdvancedTeamStats(teamStats, bsData)}
                            </React.Fragment>
                        }
                        {
                            this.state.tabIndex === 1 &&
                            <React.Fragment>
                                <h3>Player Stats</h3>
                                {renderHints(dark)}
                                {renderPlayerStats(bsData)}
                            </React.Fragment>
                        }
                        {
                            this.state.tabIndex === 2 &&
                            <React.Fragment>
                                <h3>Play By Play</h3>
                                {renderPlaybyPlay(pbpData)}
                            </React.Fragment>
                        }
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

    render() {
        const { bs: {isLoading} } = this.props
        return (
            <ThemeConsumer>
                {({state: { dark }}) =>(
                    <SettingsConsumer>
                        {({ state: {spoiler} }) => (
                            <Content dark={dark}>
                                {isLoading
                                    ? <Loader />
                                    : this.renderContent(spoiler, dark)
                                }
                            </Content>
                        )}
                    </SettingsConsumer>
                )}
            </ThemeConsumer>
        )
    }
}


const mapStateToProps = ({ bs }) => ({
    bs,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchLiveGameBoxIfNeeded,
        resetLiveGameBox,
        dispatchChangeDate,
        toggleModal,
        fetchGameHighlightIfNeeded,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(BoxScoresDetails)
