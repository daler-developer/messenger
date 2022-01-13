import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { selectCurrentUser } from "redux/reducers/authReducer"
import { selectUsers, usersActions } from "redux/reducers/usersReducer"
import { io } from "socket.io-client"
import ChatsItem from "./ChatsItem"
import Icon from "./Icon"

const ChatsPage = () => {
  const [usersOnline, setUsersOnline] = useState([])

  const [searchParams, setSearchParams] = useSearchParams()

  const users = useSelector((state) => selectUsers(state))
  const currentUser = useSelector((state) => selectCurrentUser(state))

  useEffect(() => {
    loadUsers()
    initSocket()
  }, [])

  const dispatch = useDispatch()

  const initSocket = () => {
    const socket = io('/')

    socket.emit('sendUser', currentUser._id)

    socket.on('getUsersOnline', (users) => {
      console.log(users)
      setUsersOnline(users)
    })

  }

  const isUserOnline = (user) => {
    const isOnline = Boolean(usersOnline.find((userOnline) => userOnline.userId === user._id))

    return isOnline
  }

  const loadUsers = async () => {
    await dispatch(usersActions.fetchUsers({ excludeCurrent: true }))
  }

  return (
    <div className="chats-page">
      

      {/* Header */}
      <div className="chats-page__header">

        <h1 className="chats-page__title">
          Messenger
        </h1>


        <button type="button" className="chats-page__menu-btn">
          <Icon>more_vert</Icon>
        </button>

      </div>
      {/* Header */}


      {/* Body */}
      <div className="chats-page__body">

        <input 
          type="text" 
          className="chats-page__search-input" 
          placeholder="Search user"
          value={searchParams.get('search') || ''}
          onChange={(e) => setSearchParams({ search: e.target.value })}
        />

        <div className="chats-page__chats">
          {users.map((user, i) => (
            <ChatsItem
              key={i}
              user={user}
              isOnline={isUserOnline(user)}
            />
          ))}
        </div>

      </div>
      {/* Body */}


    </div>
  )
}

export default ChatsPage
