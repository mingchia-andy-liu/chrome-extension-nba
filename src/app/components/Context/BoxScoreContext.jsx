import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'


const Context = React.createContext()

export class BoxScoreProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            hideZeroRow: false,
        }

        browser.getItem(['hideZeroRow'], (data) => {
            this.setState({
                hideZeroRow: data.hideZeroRow ? data.hideZeroRow : false,
            })
        })
    }

    static propTypes = { children: PropTypes.node }

    updateHideZeroRow = () => {
        this.setState({ hideZeroRow: !this.state.hideZeroRow }, () => {
            browser.setItem({ hideZeroRow: this.state.hideZeroRow })
        })
    }

    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: {
                    updateHideZeroRow: this.updateHideZeroRow,
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const BoxScoreConsumer = Context.Consumer
