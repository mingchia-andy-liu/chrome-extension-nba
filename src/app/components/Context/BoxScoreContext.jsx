import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'

const Context = React.createContext()

export class BoxScoreProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hideZeroRow: false,
      favPlayers: [],
    }

    browser.getItem(['hideZeroRow', 'favPlayers'], (data) => {
      this.setState({
        hideZeroRow: data.hideZeroRow ? data.hideZeroRow : false,
        favPlayers: data.favPlayers ? JSON.parse(data.favPlayers) : [],
      })
    })
  }

  static propTypes = { children: PropTypes.node }

  updateHideZeroRow = () => {
    this.setState({ hideZeroRow: !this.state.hideZeroRow }, () => {
      browser.setItem({ hideZeroRow: this.state.hideZeroRow })
    })
  }

  updateFavPlayers = (players) => {
    this.setState({ favPlayers: players }, () => {
      // Storage only supports storing and retrieving strings.
      browser.setItem({ favPlayers: JSON.stringify(players) })
    })
  }

  render() {
    return (
      <Context.Provider
        value={{
          state: this.state,
          actions: {
            updateHideZeroRow: this.updateHideZeroRow,
            updateFavPlayers: this.updateFavPlayers,
          },
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

export const BoxScoreConsumer = Context.Consumer
