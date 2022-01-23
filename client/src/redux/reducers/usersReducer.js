import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'
import { uiActions } from './uiReducer'
import { authActions, selectCurrentUserId } from 'redux/reducers/authReducer'




const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ excludeCurrent }, thunkAPI) => {
  try {    
    const { data } = await api.get(`/users?${excludeCurrent ? 'excludeCurrent=yes' : ''}`
    )

    const currenUserId = selectCurrentUserId(thunkAPI.getState())

    thunkAPI.dispatch(usersActions.clearUsersExcept(currenUserId))
    thunkAPI.dispatch(usersActions.addUsers(data.users))

    return { data }
  } catch (e) {
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.text }))

    return thunkAPI.rejectWithValue({ data: e.respones.data })
  }
})


const initialState = {
  list: [],
  fetchingStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
  usersOnlineList: [],
  isUsersOnlineStatusWatching: false
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsersOnline(state, { payload }) {
      state.usersOnlineList = payload
    },
    addUserToOnlineList(state, { payload }) {
      state.usersOnlineList.push(payload)
    },
    removeUserFromOnlineList(state, { payload }) {
      state.usersOnlineList = state.usersOnlineList.filter((userOnline) => userOnline.userId !== payload)
    },
    setUsers(state, { payload }) {
      state.list = payload
    },
    addUsers(state, { payload }) {
      state.list.push(...payload)
    },
    setIsUserHidden(state, { payload }) {
      const user = state.list.find((user) => user._id === payload.userId)
      if (user) {
        user.isHidden = payload.to
      }
    },
    setUsersFetchingStatus(state, { payload }) {
      state.fetchingStatus = payload
    },
    updateUser(state, { payload }) {
      let index = state.list.findIndex((user) => user._id === payload.userId)
      state.list[index] = payload.newUser
    },
    clearUsersExcept(state, { payload }) {
      state.list = state.list.filter((user) => user._id === payload)
    },
    setIsUsersOnlineStatusWatching(state, { payload }) {
      state.isUsersOnlineStatusWatching = payload
    },
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
    },
    // [authActions.login.fulfilled](state, { payload }) {
    //   state.list.push(payload.data.user)
    // },
    // [authActions.register.fulfilled](state, { payload }) {
    //   state.list.push(payload.data.user)
    // },
    // [authActions.loginWithToken.fulfilled](state, { payload }) {
    //   state.list.push(payload.data.user)
    // },
  }
})

export const selectUsers = (state) => {
  return state.users.list
}

export const selectUsersCount = (state) => {
  return state.users.list.length
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

export const selectIsUsersOnlineStatusWatching = (state) => {
  return state.users.isUsersOnlineStatusWatching
}

export const usersActions = {
  ...usersSlice.actions,
  fetchUsers
}

export default usersSlice.reducer
