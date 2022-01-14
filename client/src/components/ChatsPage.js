import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { authActions, selectCurrentUser } from "redux/reducers/authReducer"
import { selectUsersByIncludesDisplayName, selectUsersFetchingStatus, selectUsersOnline, usersActions } from "redux/reducers/usersReducer"
import ChatsItem from "./ChatsItem"
import Icon from "./Icon"
import PopupMenu from "./PopupMenu"

const ChatsPage = () => {
  const [isPopupMenuHidden, setIsPopupMenuHidden] = useState(true)

  const [searchParams, setSearchParams] = useSearchParams()

  const filteredUsers = useSelector((state) => selectUsersByIncludesDisplayName(state, searchParams.get('search') || ''))
  const currentUser = useSelector((state) => selectCurrentUser(state))
  const usersFetchingStatus = useSelector((state) => selectUsersFetchingStatus(state))
  const usersOnlineList = useSelector((state) => selectUsersOnline(state))

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const isUserOnline = (user) => {
    const isOnline = Boolean(usersOnlineList.find((userOnline) => userOnline.userId === user._id))

    return isOnline
  }

  const handlePopupMenuClose = () => {
    setIsPopupMenuHidden(true)
  }

  const handleOpenPopupMenuBtnClick = () => {
    setIsPopupMenuHidden(false)
  }

  const handleLogoutBtnClick = () => {
    localStorage.removeItem('auth-token')

    dispatch(authActions.logout())

    navigate('/auth?tab=login')
  }

  const handleViewProfileBtnClick = () => {
    navigate(`/messenger/profile?userId=${currentUser._id}`)
  }

  return (
    <div className="chats-page">
      

      {/* Header */}
      <div className="chats-page__header">

        <h1 className="chats-page__title">
          Messenger
        </h1>

        <div className="chats-page__header-popup-menu-wrapper">
          <button type="button" className="chats-page__menu-btn" onClick={handleOpenPopupMenuBtnClick}>
            <Icon>more_vert</Icon>
          </button>
          <PopupMenu 
            onClose={handlePopupMenuClose} 
            isHidden={isPopupMenuHidden} 
            className="chats-page__header-popup-menu"
          >
            <button type="button" className="chats-page__popup-menu-btn" onClick={handleLogoutBtnClick}>
              <Icon>logout</Icon>
              <span>Logout</span>
            </button>
            <button type="button" className="chats-page__popup-menu-btn" onClick={handleViewProfileBtnClick}>
              <Icon>account_circle</Icon>
              <span>Profile</span>
            </button>
          </PopupMenu>
        </div>

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

        {usersFetchingStatus === 'loading' && (
          <div className="chats-page__loader" />
        )}

        {usersFetchingStatus === 'loaded' && (
          <div className="chats-page__chats">
            {filteredUsers.map((user, i) => (
              <ChatsItem
                key={i}
                user={user}
                isOnline={isUserOnline(user)}
              />
            ))}
          </div>
        )}


      </div>
      {/* Body */}


    </div>
  )
}

export default ChatsPage
