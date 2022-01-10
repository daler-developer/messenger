import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'
import { uiActions } from './uiReducer'



const createMessage = createAsyncThunk('messages/createMessage', async ({ receiverId, text, imageUrl }, thunkAPI) => {
  try {
    const { data } = await api.post('/messages', {
      receiverId, text, imageUrl,
    })

    return { data }

  } catch (e) {
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const fetchMessages = createAsyncThunk('messages/fetchMessages', async ({ communicatorId }, thunkAPI) => {
  try {
    const { data } = await api.get(`/messages?communicatorId=${communicatorId}`)

    return { data }

  } catch (e) {
    thunkAPI.dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.text }))
    
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const initialState = {
  list: [],
  fetchingStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
  lastMessagesList: []
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, { payload }) {
      state.list = payload
    },
    addMessage(state, { payload }) {
      state.list.push(payload)
    },
    setMessagesFetchingStatus(state, { payload }) {
      state.fetchingStatus = payload
    },
  },
  extraReducers: {
    [createMessage.fulfilled](state, { payload }) {
      state.list.push(payload.data.message)
    },
    [fetchMessages.pending](state, { payload }) {
      state.fetchingStatus = 'loading'
    },
    [fetchMessages.rejected](state, { payload }) {
      state.fetchingStatus = 'error'
    },
    [fetchMessages.fulfilled](state, { payload }) {
      state.list = payload.data.messages
      state.fetchingStatus = 'loaded'
    }
  }
})

export const selectMessages = (state) => {
  return state.messages.list
}

export const selectLastMessages = (state) => {
  return state.messages.lastMessagesList
}

export const selectMessagesFetchingStatus = (state) => {
  return state.messages.fetchingStatus
}

export const messagesActions = {
  ...messagesSlice.actions,
  createMessage,
  fetchMessages
}

export default messagesSlice.reducer
