import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'


const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ excludeCurrent, limit, exclude }, thunkAPI) => {
  try {    
    const { data } = await api.get(`/users?${excludeCurrent ? 'excludeCurrent=yes' : ''}
      ${limit ? `&limit=${limit}` : ''}
      ${exclude ? `&exclude=${exclude}` : ''}
    `)

    return { data }

  } catch (e) {
    console.log(e)
  }
})

const initialState = {
  list: [],
  fetchingStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
  usersOnlineList: []
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersOnlineList(state, { payload }) {
      state.usersOnlineList = payload
    },
    setUsers(state, { payload }) {
      state.list = payload
    }
  },
  extraReducers: {
    [fetchUsers.pending](state, { payload }) {
      state.fetchingStatus = 'loading'
    },
    [fetchUsers.fulfilled](state, { payload }) {
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

export const selectUsersFetchingStatus = (state) => {
  return state.users.fetchingStatus
}

export const selectUsersByIncludesDisplayName = (state, displayName) => {
  return state.users.list.filter((user) => user.displayName.includes(displayName))
}

export const selectUserById = (state, _id) => {
  return state.users.list.find((user) => user._id === _id)
}

export const selectUsersOnline = (state) => {
  return state.users.usersOnlineList
}

export const usersActions = usersSlice.actions

usersActions.fetchUsers = fetchUsers

export default usersSlice.reducer
