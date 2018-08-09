import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'
import { Theme } from '../../styles'


const Context = React.createContext()

export class SettingsProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dark: false,
            team: '',
        }

        browser.getItem(['favTeam', 'nightMode'], (data) => {
            this.setState({
                dark: data.nightMode ? data.nightMode : false,
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
            browser.setItem({ nightMode:  this.state.dark })
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

    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: {
                    updateTheme: this.updateTheme,
                    updateTeam: this.updateFavouriteTeam,
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const SettingsConsumer = Context.Consumer
