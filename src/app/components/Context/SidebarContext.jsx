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
      chronological: false,
    }

    browser.getItem(['favTeam', 'broadcast', 'chronological'], (data) => {
      this.setState({
        broadcast: data.broadcast ? data.broadcast : false,
        team: data.favTeam ? data.favTeam : '',
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

  updateChronological = () => {
    this.setState({ chronological: !this.state.chronological }, () => {
      browser.setItem({ chronological: this.state.chronological })
    })
  }

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          actions: {
            updateBroadcast: this.updateBroadcast,
            updateTeam: this.updateFavouriteTeam,
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
