import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'


const Context = React.createContext()

export class BroadcastProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            broadcast: false,
        }

        browser.getItem(['broadcast'], (data) => {
            this.setState({
                broadcast: data.broadcast ? data.broadcast : false,
            })
        })
    }

    static propTypes = { children: PropTypes.node }

    updateBroadcast = () => {
        this.setState({ broadcast: !this.state.broadcast }, () => {
            browser.setItem({ broadcast: this.state.broadcast })
        })
    }

    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: {
                    updateBroadcast: this.updateBroadcast,
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const BroadcastConsumer = Context.Consumer
