import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authActions, selectCurrentUserId } from 'redux/reducers/authReducer'
import { selectUserById } from 'redux/reducers/usersReducer'
import socket from 'socket'
import Alert from './Alert'
import AuthPage from './AuthPage'
import AuthProtected from './AuthProtected'
import ChatPage from './ChatPage'
import ChatsPage from './ChatsPage'
import MessengerLayout from './MessengerLayout'
import ProfilePage from './ProfilePage'


const App = () => {
  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser) {
      socket.connect()
      sendCurrentUserToServer()
    } else {
      socket.disconnect()
    }
  }, [currentUser])

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    token && tryLoginWithToken(token)
  }, [])

  const sendCurrentUserToServer = () => {
    socket.emit('sendUser', currentUser._id)
  }

  const tryLoginWithToken = (token) => {
    dispatch(authActions.loginWithToken(token)).unwrap()
  }

  return <>
    <Routes>
      
      <Route index element={<Navigate to="messenger/chats" />} />

      <Route path="auth" element={<AuthPage />} />

      <Route element={<AuthProtected children={<MessengerLayout />} />}>
        <Route path="messenger/chats" element={<ChatsPage />} />
        <Route path="messenger/chats/:_id" element={<ChatPage />} />
        <Route path="messenger/profile/:_id" element={<ProfilePage />} />
      </Route>

    </Routes>

    <Alert />
  </>
}

export default App
