import React, { useState } from 'react'
import styled from 'styled-components'

import { teams } from '../utils/teams'
import { SidebarConsumer } from './Context'

const ListItem = styled.li`
  padding-bottom: 5px;
`

const Input = styled.input`
  width: 15rem;
`

const teamNames = Object.values(teams);
const teamNameToAbbrMap = Object.keys(teams).reduce((reversed, key) => {
  reversed[teams[key]] = key;
  return reversed;
}, {});

const FavoriteTeamsDropdown = ({ existingTeams, updateFavouriteTeams }) => {
  const [newTeam, setNewTeam] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const addTeam = () => {
    const selectedTeam = teamNameToAbbrMap[selectedOption]
    if (!selectedOption) {
      setErrorMessage(
        'Please select a team from the dropdown.'
      )
      return
    }

    if (existingTeams.findIndex((p) => p === selectedTeam) > -1 ) {
      setErrorMessage('Team already exists in the list.')
      return
    }

    const newTeams = [...existingTeams, selectedTeam]

    updateFavouriteTeams(newTeams)
    setNewTeam('')
    setErrorMessage('')
    setSelectedOption('')
  }

  const deleteTeam = (index) => {
    const updatedTeams = [...existingTeams]
    updatedTeams.splice(index, 1)
    updateFavouriteTeams(updatedTeams)
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value

    setNewTeam(inputValue)
    setSelectedOption(inputValue)
    setErrorMessage('')
  }

  return (
    <>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Input
        list="teamOptions"
        value={newTeam}
        onChange={handleInputChange}
        placeholder="Select or type a name..."
      />
      <datalist id="teamOptions">
        {teamNames.map((name, i) => (
          <option key={`team-${i}`} value={name} />
        ))}
      </datalist>
      <button onClick={addTeam}>Add Team</button>
      <ul>
        {existingTeams.map((team, index) => (
          <ListItem key={index}>
            {teams[team]}
            <button
              onClick={() => deleteTeam(index)}
              style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
          </ListItem>
        ))}
      </ul>
    </>
  )
}

const FavoriteTeamsForm = () => {
  return (
    <>
      <h2>Favorite Teams</h2>
      <SidebarConsumer>
        {({ state: { teams }, actions: { updateFavouriteTeams } }) => (
          <FavoriteTeamsDropdown
            existingTeams={teams}
            updateFavouriteTeams={updateFavouriteTeams}
          />
        )}
      </SidebarConsumer>
    </>
  )
}

export default FavoriteTeamsForm
