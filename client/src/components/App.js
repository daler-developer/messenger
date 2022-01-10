import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authActions, selectCurrentUserId } from 'redux/reducers/authReducer'
import { selectIsUsersOnlineStatusWatching, selectUserById, usersActions } from 'redux/reducers/usersReducer'
import socket from 'socket'
import Alert from './Alert'
import AuthPage from './AuthPage'
import AuthProtected from './AuthProtected'
import ChatPage from './ChatPage'
import HomePage from './HomePage'
import MessengerLayout from './MessengerLayout'
import ProfilePage from './ProfilePage'


const App = () => {
  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const isUsersOnlineStatusWatching = useSelector((state) => selectIsUsersOnlineStatusWatching(state))

  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser) {
      socket.connect()
      sendCurrentUserToServer()
      
      if (!isUsersOnlineStatusWatching) {
        watchUsersOnlineStatus()
        dispatch(usersActions.setIsUsersOnlineStatusWatching(true))
      }
    } else {
      socket.removeAllListeners()
      socket.disconnect()
      dispatch(usersActions.setUsers([]))
      dispatch(usersActions.setUsersOnline([]))
      dispatch(usersActions.setUsersFetchingStatus('idle'))
      dispatch(usersActions.setIsUsersOnlineStatusWatching(false))
    }

    return () => {
    }
  }, [currentUser])

  useEffect(() => {
    localStorage.getItem('auth-token') && tryLoginWithToken(localStorage.getItem('auth-token'))
  }, [])

  const watchUsersOnlineStatus = () => {
    socket.on('sendUsersOnline', (users) => {
      dispatch(usersActions.setUsersOnline(users))
    })
    socket.on('sendUserOnline', (user) => {
      dispatch(usersActions.addUserToOnlineList(user))
    })
    socket.on('sendUserOffline', (user) => {
      dispatch(usersActions.removeUserFromOnlineList(user.userId))
    })
  }


  const sendCurrentUserToServer = () => {
    socket.emit('sendUserOnline', currentUser._id)
  }

  const tryLoginWithToken = (token) => {
    dispatch(authActions.loginWithToken(token)).unwrap()
  }

  return <>
    <Routes>
      
      <Route index element={<Navigate to="messenger/home" />} />

      <Route path="auth" element={<AuthPage />} />

      <Route element={<AuthProtected children={<MessengerLayout />} />}>
        <Route path="messenger/home" element={<HomePage />} />
        <Route path="messenger/chats/:_id" element={<ChatPage />} />
        <Route path="messenger/profile/:_id" element={<ProfilePage />} />
      </Route>

    </Routes>

    <Alert />
  </>
}

export default App
