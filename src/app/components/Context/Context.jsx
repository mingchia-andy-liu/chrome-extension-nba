import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'
import { Theme } from '../../styles'


const Context = React.createContext()

export class SettingsProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            broadcast: false,
            dark: false,
            hideZeroRow: false,
            spoiler: false,
            team: '',
        }

        browser.getItem(['favTeam', 'nightMode', 'hideZeroRow', 'broadcast', 'spoiler'], (data, err) => {
            if (err || !data) {
                return
            }
            this.setState({
                broadcast: data.broadcast ? data.broadcast : false,
                dark: data.nightMode ? data.nightMode : false,
                hideZeroRow: data.hideZeroRow ? data.hideZeroRow : false,
                spoiler: data.spoiler ? data.spoiler : false,
                team: data.favTeam ? data.favTeam : '',
            })
            if (data.nightMode) {
                document.documentElement.style.setProperty('--bg-color', Theme.dark.baseBackground)
                document.documentElement.style.setProperty('--color', Theme.dark.color)
            }
        })
    }

    static propTypes = { children: PropTypes.node }

    updateTheme = () => {
        this.setState({ dark: !this.state.dark }, () => {
            browser.setItem({ nightMode: this.state.dark })
            if (this.state.dark) {
                document.documentElement.style.setProperty('--bg-color', Theme.dark.baseBackground)
                document.documentElement.style.setProperty('--color', Theme.dark.color)
            } else {
                document.documentElement.style.setProperty('--bg-color', Theme.light.baseBackground)
                document.documentElement.style.setProperty('--color', Theme.light.color)
            }
        })
    }

    updateFavouriteTeam = (team) => {
        this.setState({team}, () => {
            browser.setItem({ favTeam: this.state.team })
        })
    }

    updateHideZeroRow = () => {
        this.setState({ hideZeroRow: !this.state.hideZeroRow }, () => {
            browser.setItem({ hideZeroRow: this.state.hideZeroRow })
        })
    }

    updateBroadcast = () => {
        this.setState({ broadcast: !this.state.broadcast }, () => {
            browser.setItem({ broadcast: this.state.broadcast })
        })
    }

    updateNoSpoiler = () => {
        this.setState({ spoiler: !this.state.spoiler }, () => {
            browser.setItem({ spoiler: this.state.spoiler })
        })
    }

    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: {
                    updateBroadcast: this.updateBroadcast,
                    updateHideZeroRow: this.updateHideZeroRow,
                    updateNoSpoiler: this.updateNoSpoiler,
                    updateTeam: this.updateFavouriteTeam,
                    updateTheme: this.updateTheme,
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const SettingsConsumer = Context.Consumer
