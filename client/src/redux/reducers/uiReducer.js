import { createSlice } from '@reduxjs/toolkit'
import { authActions } from './authReducer'



const initialState = {
  currentVisibleModal: null,
  alert: {
    type: null,
    text: null,
    isHidden: true
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentVisibleModal(state, { payload }) {
      state.currentVisibleModal = payload
    },
    openAlert(state, { payload }) {
      state.alert.type = payload.type
      state.alert.text = payload.text
      state.alert.isHidden = false
    },
    closeAlert(state) {
      state.alert.type = null
      state.alert.text = null
      state.alert.isHidden = true
    },
  }
})

export const selectCurrentVisibleModal = (state) => {
  return state.ui.currentVisibleModal
}

export const selectAlert = (state) => {
  return state.ui.alert
}

export const uiActions = uiSlice.actions

export default uiSlice.reducer
