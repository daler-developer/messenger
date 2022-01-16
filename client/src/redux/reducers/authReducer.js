import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'
import { uiActions } from './uiReducer'
import { usersActions } from './usersReducer'



const login = createAsyncThunk('auth/login', async ({ username, password }, thunkAPI) => {
  try {
    
    const { data } = await api.post('/users/login', {
      username, password
    })

    thunkAPI.dispatch(usersActions.addUsers([data.user]))
    thunkAPI.dispatch(uiActions.openAlert({ type: 'success', text: 'Logged in' }))

    return { data }

  } catch (e) {
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.message }))

    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const loginWithToken = createAsyncThunk('auth/login-with-token', async (token, thunkAPI) => {
  try {

    const { data } = await api.post('/users/login-with-token', {
      token
    })

    thunkAPI.dispatch(usersActions.addUsers([data.user]))
    thunkAPI.dispatch(uiActions.openAlert({ type: 'success', text: 'Logged in' }))

    return { data }
    
  } catch (e) {
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const register = createAsyncThunk('auth/register', async ({ username, password, displayName }, thunkAPI) => {
  try {
    
    const { data } = await api.post('/users/register', {
      username, password, displayName
    })

    thunkAPI.dispatch(usersActions.addUsers([data.user]))
    thunkAPI.dispatch(uiActions.openAlert({ type: 'success', text: 'Registed' }))

    return { data }

  } catch (e) {
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.message }))
    
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const updateProfile = createAsyncThunk('auth/updateProfile', async (props, thunkAPI) => {
  try {
    const _id = thunkAPI.getState().auth.currentUser._id
    const { data } = await api.put(`/users/${_id}`, props)

    thunkAPI.dispatch(uiActions.openAlert({ type: 'success', text: 'Updated profile' }))

    return { data }
    
  } catch (e) {
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.message }))
    
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const initialState = {
  // currentUser: null,
  currentUserId: null,
  isTryingToLogin: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUserId(state, { payload }) {
      state.currentUserId = payload
    }
  },
  extraReducers: {
    [register.fulfilled](state, { payload }) {
      state.currentUserId = payload.data.user._id
    },
    [loginWithToken.pending](state, { payload }) {
      state.isTryingToLogin = true
    },
    [loginWithToken.fulfilled](state, { payload }) {
      state.currentUserId = payload.data.user._id
      state.isTryingToLogin = false
    },
    [loginWithToken.rejected](state, { payload }) {
      state.isTryingToLogin = false
    },
    [login.fulfilled](state, { payload }) {
      state.currentUserId = payload.data.user._id
    },
    // [updateProfile.fulfilled](state, { payload }) {
    //   state.currentUser = payload.user
    // }
  }
})

export const selectCurrentUserId = (state) => {
  return state.auth.currentUserId
}

export const selectIsAuthenticated = (state) => {
  return Boolean(state.auth.currentUser._id)
}

export const selectIsTryingToLogin = (state) => {
  return state.auth.isTryingToLogin
}

export const authActions = authSlice.actions

authActions.login = login
authActions.loginWithToken = loginWithToken
authActions.register = register
// authActions.updateProfile = updateProfile

export default authSlice.reducer
