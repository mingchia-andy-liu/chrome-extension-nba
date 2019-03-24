import React from 'react'
import { Switch, Route, Redirect, withRouter  } from 'react-router-dom'
import styled from 'styled-components'
import PopUp from '../Popup'
import BoxScores from '../BoxScores'
import Standings from '../Standings'
import Options from '../Options'
import Changelog from '../Changelog'
import Playoffs from '../Playoffs'
import {
    SidebarProvider,
    SettingsProvider,
    ThemeProvider,
    BoxScoreProvider
} from '../../components/Context'

import 'react-sticky-table/dist/react-sticky-table.css'
import 'flatpickr/dist/flatpickr.min.css'

const AppBase = styled.div``

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ThemeProvider>
                <SidebarProvider>
                    <BoxScoreProvider>
                        <SettingsProvider>
                            <AppBase>
                                <Switch>
                                    <Route exact path="/popup" component={ PopUp } />
                                    <Route path="/boxscores/:id" component={ BoxScores } />
                                    <Route path="/boxscores" component={ BoxScores } />
                                    <Route exact path="/changelog" component={ Changelog } />
                                    <Route exact path="/options" component={ Options } />
                                    <Route exact path="/playoffs" component={ Playoffs } />
                                    <Route exact path="/standings" component={ Standings } />
                                    <Redirect path="*" to="/popup" />
                                </Switch>
                            </AppBase>
                        </SettingsProvider>
                    </BoxScoreProvider>
                </SidebarProvider>
            </ThemeProvider>
        )
    }
}

App.propTypes = {

}

export default withRouter(App)
