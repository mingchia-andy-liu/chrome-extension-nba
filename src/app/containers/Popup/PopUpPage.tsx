import * as React from 'react'
import { withRouter } from 'react-router-dom'
import PopUp from './Popup'
import {
  SidebarProvider,
  SettingsProvider,
  ThemeProvider,
} from '../../components/Context'
import { GlobalStyle } from '../../styles'

import 'flatpickr/dist/flatpickr.min.css'

const App = () => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <SettingsProvider>
          <GlobalStyle />
          <PopUp />
        </SettingsProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default withRouter(App)
