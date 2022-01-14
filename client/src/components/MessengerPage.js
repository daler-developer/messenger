import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { selectUsersOnline, usersActions } from 'redux/reducers/usersReducer'
import { selectCurrentUser } from "redux/reducers/authReducer"
import socket from "socket"


const MessengerPage = () => {

  const dispatch = useDispatch()

  const currentUser = useSelector((state) => selectCurrentUser(state))

  useEffect(() => {
    sendCurrentUserToServer()
    watchUsersOnline()
    loadUsers({ excludeCurrent: true })
  }, [])

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

      dispatch(usersActions.setUsers(data.users))
      
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
