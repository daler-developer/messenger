import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducers/authReducer"
import uiReducer from "./reducers/uiReducer"
import usersReducer from "./reducers/usersReducer"


const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: usersReducer
  }
})

export default store
