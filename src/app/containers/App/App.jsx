import React from 'react'
import { Switch, Route, Redirect, withRouter  } from 'react-router-dom'
import styled from 'styled-components'
import PopUp from '../PopUp'
import BoxScores from '../BoxScores'

import 'react-sticky-table/dist/react-sticky-table.css'
import 'flatpickr/dist/themes/dark.css'

const AppBase = styled.div``

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <AppBase>
                <Switch>
                    <Route exact path="/popup" component={ PopUp } />
                    <Route path="/boxscores/:id" component={ BoxScores } />
                    <Route path="/boxscores" component={ BoxScores } />
                    <Route exact path="/changelog" component={ PopUp } />
                    <Route exact path="/options" component={ PopUp } />
                    <Route exact path="/playoff" component={ PopUp } />
                    <Route exact path="/standings" component={ PopUp } />
                    <Redirect path="*" to="/popup" />
                </Switch>
            </AppBase>
        )
    }
}

App.propTypes = {

}

export default withRouter(App)
