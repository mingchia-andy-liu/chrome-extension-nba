import * as React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
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
  BoxScoreProvider,
} from '../../components/Context'
import { GlobalStyle } from '../../styles'

import 'flatpickr/dist/flatpickr.min.css'

const App = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <BoxScoreProvider>
          <SettingsProvider>
            <GlobalStyle />
            <Switch>
              <Route exact path="/popup" component={PopUp} />
              <Route path="/boxscores/:id" component={BoxScores} />
              <Route path="/boxscores" component={BoxScores} />
              <Route exact path="/changelog" component={Changelog} />
              <Route exact path="/options" component={Options} />
              <Route exact path="/playoffs" component={Playoffs} />
              <Route exact path="/standings" component={Standings} />
              <Redirect path="*" to="/popup" />
            </Switch>
          </SettingsProvider>
        </BoxScoreProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default withRouter(App)
