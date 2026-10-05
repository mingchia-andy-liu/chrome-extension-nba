import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
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
            <Routes>
              <Route path="/popup" element={<PopUp />} />
              <Route path="/boxscores/:id" element={<BoxScores />} />
              <Route path="/boxscores" element={<BoxScores />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/options" element={<Options />} />
              <Route path="/playoffs" element={<Playoffs />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="*" element={<Navigate to="/popup" replace />} />
            </Routes>
          </SettingsProvider>
        </BoxScoreProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
