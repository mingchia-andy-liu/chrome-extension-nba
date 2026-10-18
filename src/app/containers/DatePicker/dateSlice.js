import { createSlice } from '@reduxjs/toolkit'
import getAPIDate from '../../utils/getApiDate'

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    date: getAPIDate(),
  },
  reducers: {
    changeDate: (state, action) => {
      state.date = action.payload
    },
  },
})

export const { changeDate } = dateSlice.actions

export const selectDate = (state) => state.date.date

export default dateSlice.reducer
