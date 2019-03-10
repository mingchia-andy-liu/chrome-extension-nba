import React from 'react'
import PropTypes from 'prop-types'

import browser from '../../utils/browser'
import { Theme } from '../../styles'


const Context = React.createContext()

export class ThemeProvider extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dark: false,
        }

        browser.getItem(['nightMode'], (data) => {
            this.setState({
                dark: data.nightMode ? data.nightMode : false,
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

    render() {
        return (
            <Context.Provider value={{
                state: this.state,
                actions: {
                    updateTheme: this.updateTheme,
                },
            }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const ThemeConsumer = Context.Consumer
