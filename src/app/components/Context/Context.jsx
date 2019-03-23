import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'


const Context = React.createContext()

export class SettingsProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            spoiler: false,
        }

        browser.getItem(['spoiler'], (data) => {
            this.setState({
                spoiler: data.spoiler ? data.spoiler : false,
                team: data.favTeam ? data.favTeam : '',
            })
        })
    }

    static propTypes = { children: PropTypes.node }

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
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const SettingsConsumer = Context.Consumer
