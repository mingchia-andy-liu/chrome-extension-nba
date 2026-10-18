import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'

const Context = React.createContext()

export class BoxScoreProvider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hideZeroRow: false,
      showFantasyPoints: false,
      favPlayers: [],
    }

    browser.getItem(
      ['hideZeroRow', 'showFantasyPoints', 'favPlayers'],
      (data) => {
        let favPlayers = []
        try {
          const storedPlayers = JSON.parse(data.favPlayers)
          favPlayers = Array.isArray(storedPlayers) ? storedPlayers : []
        } catch (error) {
          favPlayers = []
        }

        this.setState({
          hideZeroRow: data.hideZeroRow ? data.hideZeroRow : false,
          showFantasyPoints: data.showFantasyPoints
            ? data.showFantasyPoints
            : false,
          favPlayers,
        })
      }
    )
  }

  static propTypes = { children: PropTypes.node }

  updateHideZeroRow = () => {
    this.setState({ hideZeroRow: !this.state.hideZeroRow }, () => {
      browser.setItem({ hideZeroRow: this.state.hideZeroRow })
    })
  }

  updateShowFantasyPoints = () => {
    this.setState({ showFantasyPoints: !this.state.showFantasyPoints }, () => {
      browser.setItem({ showFantasyPoints: this.state.showFantasyPoints })
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
            updateShowFantasyPoints: this.updateShowFantasyPoints,
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
