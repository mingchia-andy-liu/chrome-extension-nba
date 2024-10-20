import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'

const Context = React.createContext()

export class SidebarProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      broadcast: false,
      teams: [],
      chronological: false,
    }

    browser.getItem(['favTeams', 'broadcast', 'chronological'], (data) => {
      this.setState({
        broadcast: data.broadcast ? data.broadcast : false,
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
