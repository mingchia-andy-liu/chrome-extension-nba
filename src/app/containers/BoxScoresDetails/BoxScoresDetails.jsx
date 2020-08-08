import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import Overlay from '../../components/Overlay'
import Loader from '../../components/Loader'
import { Tab, TabItem } from '../../components/Tab'
import { NoSpoilerCheckbox } from '../../components/Checkbox'
import { SettingsConsumer, ThemeConsumer } from '../../components/Context'
import {
  fetchLiveGameBoxIfNeeded,
  resetLiveGameBox,
  fetchGameHighlightIfNeeded,
} from './actions'
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
  renderHighlight,
  renderTeamLeader,
} from './helpers'
import { DATE_FORMAT } from '../../utils/constant'

const BoxScoresDetails = ({
  bs: { bsData, pbpData, teamStats, urls, isLoading },
  id,
  date,
  fetchLiveGameBoxIfNeeded,
  fetchGameHighlightIfNeeded,
}) => {
  // tab index: 0: overview 1: boxscores 2: playbyplay
  const [tabIndex, toggleIndex] = React.useState(1)

  React.useEffect(() => {
    const gameId = id || ''
    const dateStr = format(date, DATE_FORMAT)
    fetchLiveGameBoxIfNeeded(dateStr, gameId, false).then(() => {
      fetchGameHighlightIfNeeded(gameId)
    })
    return () => resetLiveGameBox()
  }, [])

  const renderContent = React.useCallback((spoiler, dark) => {
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
        const url = urls[id || '']
        return (
          <React.Fragment>
            <Tab
              onTabSelect={toggleIndex}
              index={tabIndex}
              isLink={false}
            >
              <TabItem label="Match up" />
              <TabItem label="Box-scores" />
              <TabItem label="Play-by-Play" />
            </Tab>
            <br />
            {tabIndex === 0 && (
              <React.Fragment>
                {renderTitle(bsData)}
                {renderHighlight(url)}
                {renderSummary(bsData, teamStats)}
                {bsData.periodTime &&
                  bsData.periodTime.gameStatus === '3' &&
                  renderTeamLeader(bsData)}
                <h3>Team Stats</h3>
                {renderTeamStats(bsData)}
                <h4>Advanced</h4>
                {renderAdvancedTeamStats(teamStats, bsData)}
              </React.Fragment>
            )}
            {tabIndex === 1 && (
              <React.Fragment>
                <h3>Player Stats</h3>
                {renderHints(dark)}
                {renderPlayerStats(bsData)}
              </React.Fragment>
            )}
            {tabIndex === 2 && (
              <React.Fragment>
                <h3>Play By Play</h3>
                {renderPlaybyPlay(pbpData)}
              </React.Fragment>
            )}
          </React.Fragment>
        )
      }
    }
    return (
      <Switch>
        <Route path="/boxscores/:id" component={contentComponent} />
        <Route path="/boxscores" component={Overlay} />
      </Switch>
    )
  }, [bsData, pbpData, teamStats, urls, toggleIndex, tabIndex])

  return (
    <ThemeConsumer>
      {({ state: { dark } }) => (
        <SettingsConsumer>
          {({ state: { spoiler } }) => (
            <Content dark={dark}>
              {isLoading ? <Loader /> : renderContent(spoiler, dark)}
            </Content>
          )}
        </SettingsConsumer>
      )}
    </ThemeConsumer>
  )
}

BoxScoresDetails.propTypes = {
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
  fetchGameHighlightIfNeeded: PropTypes.func.isRequired,

  id: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
}

const mapStateToProps = ({ bs }) => ({
  bs,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchLiveGameBoxIfNeeded,
      resetLiveGameBox,
      dispatchChangeDate,
      fetchGameHighlightIfNeeded,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BoxScoresDetails)
