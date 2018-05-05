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
                    <Route exact path="/index.html" component={ PopUp } />
                    <Route path="/box-scores2.html" component={ BoxScores } />
                    <Route exact path="/changelog2.html" component={ PopUp } />
                    <Route exact path="/options2.html" component={ PopUp } />
                    <Route exact path="/playoff2.html" component={ PopUp } />
                    <Route exact path="/standings2.html" component={ PopUp } />
                    <Redirect path="*" to="/index.html" />
                </Switch>
            </AppBase>
        )
    }
}

App.propTypes = {

}

export default withRouter(App)
