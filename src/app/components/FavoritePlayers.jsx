import React, { useState } from 'react'
import styled from 'styled-components'
import { players } from '../utils/players'
import { BoxScoreConsumer } from './Context'

const ListItem = styled.li`
  padding-bottom: 5px;
`

const Input = styled.input`
  width: 15rem;
`

const getName = (p) => p.PLAYER_FIRST_NAME + ' ' + p.PLAYER_LAST_NAME
const allowedPlayers = players
  .map((p) => ({ name: getName(p), id: p.PERSON_ID }))
  .sort((a, b) => a.name.localeCompare(b.name))
const allowedPlayersMap = players.reduce(
  (accu, curr) => accu.set(getName(curr), curr),
  new Map()
)

const FavoritePlayersDropdown = ({ existingPlayers, updateFavPlayers }) => {
  const [newName, setNewName] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const addName = () => {
    const selectedName = selectedOption
    if (!selectedOption || !allowedPlayersMap.get(selectedName)) {
      setErrorMessage(
        'Please select a name from the dropdown or type a valid name.'
      )
      return
    }

    if (
      existingPlayers.findIndex(
        (p) => getName(p).toLowerCase() === selectedName.toLowerCase()
      ) > -1
    ) {
      setErrorMessage('Name already exists in the list.')
      return
    }

    const newPlayers = [...existingPlayers, allowedPlayersMap.get(selectedName)]

    updateFavPlayers(newPlayers)
    setNewName('')
    setErrorMessage('')
    setSelectedOption('')
  }

  const deleteName = (index) => {
    const updatedPlayers = [...existingPlayers]
    updatedPlayers.splice(index, 1)
    updateFavPlayers(updatedPlayers)
  }

  const handleInputChange = (e) => {
    const inputValue = e.target.value

    setNewName(inputValue)
    setSelectedOption(inputValue)
    setErrorMessage('')
  }

  const filteredOptions = allowedPlayers.filter(({ name }) => {
    return name.toLowerCase().includes(newName.toLowerCase())
  })

  return (
    <>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Input
        list="nameOptions"
        value={newName}
        onChange={handleInputChange}
        placeholder="Select or type a name..."
      />
      <datalist id="nameOptions">
        {filteredOptions.map(({ id, name }) => (
          <option key={id} value={name} />
        ))}
      </datalist>
      <button onClick={addName}>Add Name</button>
      <ul>
        {existingPlayers.map((player, index) => (
          <ListItem key={index}>
            {getName(player)}
            <button
              onClick={() => deleteName(index)}
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

const FavoritePlayersForm = () => {
  return (
    <>
      <h2>Favorite Players</h2>
      <BoxScoreConsumer>
        {({ state: { favPlayers }, actions: { updateFavPlayers } }) => (
          <FavoritePlayersDropdown
            existingPlayers={favPlayers}
            updateFavPlayers={updateFavPlayers}
          />
        )}
      </BoxScoreConsumer>
    </>
  )
}

export default FavoritePlayersForm
