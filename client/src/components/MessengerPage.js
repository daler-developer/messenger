import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { selectUserById, selectUsersOnline, usersActions } from 'redux/reducers/usersReducer'
import { selectCurrentUserId } from "redux/reducers/authReducer"
import socket from "socket"


const MessengerPage = () => {

  const dispatch = useDispatch()

  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))

  useEffect(() => {
    connectSocketIfDisconnected()
    sendCurrentUserToServer()
    watchUsersOnline()
    loadUsers({ excludeCurrent: true })

    return () => {
      socket.removeAllListeners('getUsersOnline')
    }
  }, [])

  const connectSocketIfDisconnected = () => {
    if (socket.disconnected) {
      socket.connect()
    }
  }

  const sendCurrentUserToServer = () => {
    socket.emit('sendUser', currentUser._id)
  }

  const watchUsersOnline = () => {
    socket.on('getUsersOnline', (users) => {
      dispatch(usersActions.setUsersOnlineList(users))
    })
  }

  const loadUsers = async ({ excludeCurrent, limit, exclude }) => {
    try {
      const { data } = await dispatch(usersActions.fetchUsers({ excludeCurrent, limit, exclude })).unwrap()

      dispatch(usersActions.addUsers(data.users))
      
    } catch (e) {
      
    }
  }

  return (
    <div className="messenger-page">
      <div className="messenger-page__body">

        <Outlet />

      </div>
    </div>
  )
}

export default MessengerPage
