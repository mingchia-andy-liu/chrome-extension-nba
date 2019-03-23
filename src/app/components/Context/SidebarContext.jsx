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
        }

        browser.getItem(['favTeam', 'broadcast'], (data) => {
            this.setState({
                broadcast: data.broadcast ? data.broadcast : false,
                team: data.favTeam ? data.favTeam : '',
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
        this.setState({team}, () => {
            browser.setItem({ favTeam: this.state.team })
        })
    }


    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: {
                    updateBroadcast: this.updateBroadcast,
                    updateTeam: this.updateFavouriteTeam,
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const SidebarConsumer = Context.Consumer
