import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'


const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ excludeCurrent }, thunkAPI) => {
  try {
    
    const { data } = await api.get(`/users?excludeCurrent=${excludeCurrent ? 'yes' : 'no'}`)

    return { data }

  } catch (e) {
    console.log(e)
  }
})

const initialState = {
  list: [],
  fetchingStatus: 'idle' // 'idle', 'loading', 'loaded', 'error'
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {

  },
  extraReducers: {
    [fetchUsers.pending](state, { payload }) {
      state.fetchingStatus = 'loading'
    },
    [fetchUsers.fulfilled](state, { payload }) {
      state.list = payload.data.users
      state.fetchingStatus = 'loaded'
    },
    [fetchUsers.rejected](state, { payload }) {
      state.fetchingStatus = 'error'
    }
  }
})

export const selectUsers = (state) => {
  return state.users.list
}

export const usersActions = usersSlice.actions

usersActions.fetchUsers = fetchUsers

export default usersSlice.reducer
