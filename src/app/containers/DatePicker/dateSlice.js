import { createSlice } from '@reduxjs/toolkit'
import isValid from 'date-fns/isValid'
import getAPIDate from '../../utils/getApiDate'

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    date: getAPIDate(),
  },
  reducers: {
    changeDate: (state, action) => {
      if (isValid(action.payload)) {
        state.date = action.payload
      }
    },
  },
})

export const { changeDate } = dateSlice.actions

export const selectDate = (state) =>
  isValid(state.date.date) ? state.date.date : getAPIDate()

export default dateSlice.reducer
