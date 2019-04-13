import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import Overlay from '../../components/Overlay'
import Loader from '../../components/Loader'
import { NoSpoilerCheckbox } from '../../components/Checkbox'
import { SettingsConsumer, ThemeConsumer } from '../../components/Context'
import { fetchLiveGameBoxIfNeeded, resetLiveGameBox, fetchGameHighlightIfNeeded } from './actions'
import { dispatchChangeDate } from '../DatePicker/actions'
import { Content } from './styles'
import {
    renderTitle,
    renderSummary,
    renderHints,
    renderPlayerStats,
    renderTeamStats,
    renderAdvancedTeamStats,
    renderPlaybyPlay,
    renderHighlightButton
} from './helpers'
import modalType from '../Modal/modal-types'
import { toggleModal } from '../Modal/actions'

class BoxScoresDetails extends React.Component {
    static propTypes = {
        bs: PropTypes.shape({
            isLoading: PropTypes.bool.isRequired,
            bsData: PropTypes.object.isRequired,
            pbpData: PropTypes.object.isRequired,
            teamStats: PropTypes.object.isRequired,
            urls: PropTypes.object.isRequired,
        }),
        date: PropTypes.object.isRequired,

        fetchLiveGameBoxIfNeeded: PropTypes.func.isRequired,
        resetLiveGameBox: PropTypes.func.isRequired,
        dispatchChangeDate: PropTypes.func.isRequired,
        toggleModal: PropTypes.func.isRequired,
        fetchGameHighlightIfNeeded: PropTypes.func.isRequired,
        id: PropTypes.string,
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
        return this.props.id
    }

    componentDidMount() {
        const {date} = this.props
        const id = this.getIdFromProps()
        this.props.fetchLiveGameBoxIfNeeded(date, id, false).then(() => {
            this.props.fetchGameHighlightIfNeeded(id)
        })
    }

    componentWillUnmount() {
        this.props.resetLiveGameBox()
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
                        {renderTitle(bsData)}
                        {renderHighlightButton(url, dark, this.clickHighlight)}
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

