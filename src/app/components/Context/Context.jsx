import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'


const Context = React.createContext()

export class SettingsProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            spoiler: false,
            team: '',
        }

        browser.getItem(['favTeam', 'spoiler'], (data) => {
            this.setState({
                spoiler: data.spoiler ? data.spoiler : false,
                team: data.favTeam ? data.favTeam : '',
            })
        })
    }

    static propTypes = { children: PropTypes.node }

    updateFavouriteTeam = (team) => {
        this.setState({team}, () => {
            browser.setItem({ favTeam: this.state.team })
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
                    updateNoSpoiler: this.updateNoSpoiler,
                    updateTeam: this.updateFavouriteTeam,
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const SettingsConsumer = Context.Consumer
