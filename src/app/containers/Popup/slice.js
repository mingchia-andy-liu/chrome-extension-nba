import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  hasError: false,
  isLoading: true,
  games: [],
  lastUpdate: new Date(0),
  urls: {},
}

export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})

const gamesSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    pending
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGames.pending, (state, action) => {
        state.isLoading = true
        state.hasError = false;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        const isFallBack = action.payload.isFallBack
        state.games = sanitizeGames(action.payload.games, isFallBack)
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false
        state.hasError = true
        state.games = []
        state.lastUpdate = new Date(0)
      })
  }
})

// export const { fetchGames } = gamesSlice.actions

export default gamesSlice.reducer
