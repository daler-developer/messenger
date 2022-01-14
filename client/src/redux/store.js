import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./reducers/authReducer"
import messagesReducer from "./reducers/messagesReducer"
import uiReducer from "./reducers/uiReducer"
import usersReducer from "./reducers/usersReducer"


const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: usersReducer,
    messages: messagesReducer
  }
})

export default store
