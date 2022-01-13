import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authActions } from 'redux/reducers/authReducer'
import { io } from 'socket.io-client'
import Alert from './Alert'
import AuthPage from './AuthPage'
import AuthProtected from './AuthProtected'
import ChatsPage from './ChatsPage'
import MessengerPage from './MessengerPage'
import ProfilePage from './ProfilePage'


const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    token && tryLoginWithToken(token)
  }, [])

  const tryLoginWithToken = (token) => {
    dispatch(authActions.loginWithToken(token)).unwrap()
  }

  return <>
    <Routes>
      
      <Route index element={<Navigate to="messenger" />} />

      <Route path="auth" element={<AuthPage />} />

      <Route path="messenger" element={<AuthProtected children={<MessengerPage />} />}>
        <Route path="chats" element={<ChatsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

    </Routes>

    <Alert />
  </>
}

export default App
