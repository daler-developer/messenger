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

    localStorage.setItem('auth-token', data.token)

    return { data }

  } catch (e) {
    const message = e.response.data.message
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: message }))

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

    localStorage.setItem('auth-token', data.token)

    return { data }

  } catch (e) {
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.message }))
    
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const updateProfile = createAsyncThunk('users/updateProfile', async (props, thunkAPI) => {
  try {
    console.log(props)
    const _id = thunkAPI.getState().auth.currentUserId
    const { data } = await api.put(`/users/${_id}`, props)

    thunkAPI.dispatch(usersActions.updateUser({ userId: data.user._id, newUser: data.user }))

    return { data }
    
  } catch (e) {
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.message }))
    
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const initialState = {
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

export const authActions = {
  ...authSlice.actions,
  login,
  updateProfile,
  loginWithToken,
  register,
  updateProfile
}

export default authSlice.reducer
