import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'

const Context = React.createContext()

export class SidebarProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      broadcast: false,
      team: '',
      teams: [],
      chronological: false,
    }

    browser.getItem(['favTeam', 'favTeams', 'broadcast', 'chronological'], (data) => {
      this.setState({
        broadcast: data.broadcast ? data.broadcast : false,
        team: data.favTeam ? data.favTeam : '',
        teams: data.favTeams ? data.favTeams : [],
        chronological: data.chronological ? data.chronological : false,
      })
    })
  }

  static propTypes = { children: PropTypes.node }

  updateBroadcast = () => {
    this.setState({ broadcast: !this.state.broadcast }, () => {
      browser.setItem({ broadcast: this.state.broadcast })
    })
  }

  updateFavouriteTeam = (team) => {
    this.setState({ team }, () => {
      browser.setItem({ favTeam: this.state.team })
    })
  }

  updateFavouriteTeams = (teams) => {
    this.setState({ teams }, () => {
      browser.setItem({ favTeams: this.state.teams })
    })
  }

  updateChronological = () => {
    this.setState(
      (preState) => ({ chronological: !preState.chronological }),
      () => {
        browser.setItem({ chronological: this.state.chronological })
      }
    )
  }

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          actions: {
            updateBroadcast: this.updateBroadcast,
            updateTeam: this.updateFavouriteTeam,
            updateFavouriteTeams: this.updateFavouriteTeams,
            updateChronological: this.updateChronological,
          },
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const SidebarConsumer = Context.Consumer
