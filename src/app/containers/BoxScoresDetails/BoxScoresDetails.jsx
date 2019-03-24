import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import Overlay from '../../components/Overlay'
import Loader from '../../components/Loader'
import { NoSpoilerCheckbox } from '../../components/Checkbox'
import { SettingsConsumer, ThemeConsumer } from '../../components/Context'
import { fetchLiveGameBoxIfNeeded, resetLiveGameBox } from './actions'
import { dispatchChangeDate } from '../DatePicker/actions'
import { Content } from './styles'
import { DATE_FORMAT } from '../../utils/constant'
import {
    renderTitle,
    renderSummary,
    renderHints,
    renderPlayerStats,
    renderTeamStats,
    renderAdvancedTeamStats,
    renderPlaybyPlay
} from './helpers'
import { getDateFromQuery } from '../../utils/common'


class BoxScoresDetails extends React.Component {
    static propTypes = {
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
        match: PropTypes.object.isRequired,
        fetchLiveGameBoxIfNeeded: PropTypes.func.isRequired,
        resetLiveGameBox: PropTypes.func.isRequired,
        dispatchChangeDate: PropTypes.func.isRequired,
    }


    constructor(props) {
        super(props)

        const {
            match : { params : { id } },
            date: {date},
        } = this.props
        const dateStr = moment(date).format(DATE_FORMAT)
        const queryDate = getDateFromQuery(this.props)

        this.state = {
            id: id ? id : '',
            date: queryDate == null ? dateStr : queryDate,
        }
    }

    componentDidMount() {
        const { date, id } = this.state
        // TODO: when sync store, read the proper date from the localStorage
        this.props.dispatchChangeDate(moment(date, DATE_FORMAT).toDate())
        this.props.fetchLiveGameBoxIfNeeded(date, id, false)
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


const mapStateToProps = ({ bs, date }) => ({
    bs,
    date,
})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchLiveGameBoxIfNeeded,
        resetLiveGameBox,
        dispatchChangeDate,
    }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BoxScoresDetails))
