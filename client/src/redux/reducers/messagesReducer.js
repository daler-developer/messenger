import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from 'utils/api'



const createMessage = createAsyncThunk('messages/createMessage', async ({ receiverId, text }, thunkAPI) => {
  try {
    const { data } = await api.post('/messages', {
      receiverId, text
    })

    return { data }

  } catch (e) {
    console.log('----------------', e.response)
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const fetchMessages = createAsyncThunk('messages/fetchMessages', async ({ communicatorId }, thunkAPI) => {
  try {
    const { data } = await api.get(`/messages?communicatorId=${communicatorId}`)

    return { data }

  } catch (e) {
    return thunkAPI.rejectWithValue({ data: e.response.data })
  }
})

const initialState = {
  list: [],
  fetchingStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
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
    }
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
      state.fetchingStatus = 'loaded'
    },
  }
})

export const selectMessages = (state) => {
  return state.messages.list
}

export const messagesActions = messagesSlice.actions

messagesActions.createMessage = createMessage
messagesActions.fetchMessages = fetchMessages


export default messagesSlice.reducer
