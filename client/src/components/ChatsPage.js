import classNames from "classnames"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { authActions, selectCurrentUserId } from "redux/reducers/authReducer"
import { selectUserById, selectUsersByIncludesDisplayName, selectUsersFetchingStatus, selectUsersOnline, usersActions } from "redux/reducers/usersReducer"
import socket from "socket"
import ChatsItem from "./ChatsItem"
import Icon from "./Icon"
import Loader from "./Loader"
import PopupMenu from "./PopupMenu"
import PopupMenuBtn from "./PopupMenuBtn"


const ChatsPage = () => {
  const [isPopupMenuHidden, setIsPopupMenuHidden] = useState(true)
  const [isSearchInputWrapperActive, setIsSearchInputWrapperActive] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const filteredUsers = useSelector((state) => selectUsersByIncludesDisplayName(state, searchParams.get('search') || ''))
  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const usersFetchingStatus = useSelector((state) => selectUsersFetchingStatus(state))
  const usersOnlineList = useSelector((state) => selectUsersOnline(state))

  useEffect(() => {
    if (usersFetchingStatus === 'idle') {
      loadUsers({ excludeCurrent: true })
    }
    watchLastMessages()
    watchUsersOnline()

    return () => {
      socket.removeAllListeners('getUsersOnline')
    }
  }, [])

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const getIsUserOnline = (user) => {
    const isOnline = Boolean(usersOnlineList.find((userOnline) => userOnline.userId === user._id))

    return isOnline
  }

  const watchUsersOnline = () => {
    socket.on('getUsersOnline', (users) => {
      dispatch(usersActions.setUsersOnlineList(users))
    })
  }

  const watchLastMessages = () => {

  }

  const loadUsers = async ({ excludeCurrent, limit, exclude }) => {
    try {
      const { data } = await dispatch(usersActions.fetchUsers({ excludeCurrent, limit, exclude })).unwrap()

      dispatch(usersActions.addUsers(data.users))
      
    } catch (e) {
      
    }
  }

  const handlePopupMenuClose = () => {
    setIsPopupMenuHidden(true)
  }

  const handleOpenPopupMenuBtnClick = (e) => {
    setIsPopupMenuHidden(false)
  }

  const handleLogoutBtnClick = () => {
    localStorage.removeItem('auth-token')

    socket.disconnect()

    dispatch(authActions.setCurrentUserId(null))
    dispatch(usersActions.setUsers([]))
    dispatch(usersActions.setUsersFetchingStatus('idle'))

    navigate('/auth?tab=login')
  }

  const handleViewProfileBtnClick = () => {
    navigate(`/messenger/profile/${currentUser._id}`)
  }

  const handleSearchInputFocus = () => {
    setIsSearchInputWrapperActive(true)
  }

  const handleSearchInputBlur = () => {
    setIsSearchInputWrapperActive(false)
  }

  const handleReloadBtnClick = () => {
    dispatch(usersActions.clearUsersExcept(currentUser._id))
    loadUsers({ excludeCurrent: true })
    setIsPopupMenuHidden(true)
  }

  return (
    <div className="chats-page">
      

      {/* Header */}
      <div className="chats-page__header">

        <h1 className="chats-page__title">
          Home
        </h1>

        <div className="chats-page__menu-wrapper">
          <button type="button" className="chats-page__open-menu-btn" onClick={handleOpenPopupMenuBtnClick}>
            <Icon>more_vert</Icon>
          </button>
          <PopupMenu 
            onClose={handlePopupMenuClose} 
            isHidden={isPopupMenuHidden} 
            className="chats-page__menu"
          >
            <PopupMenuBtn icon="logout" onClick={handleLogoutBtnClick}>
              Logout
            </PopupMenuBtn>
            <PopupMenuBtn icon="person" onClick={handleViewProfileBtnClick}>
              Profile
            </PopupMenuBtn>
            <PopupMenuBtn icon="restart_alt" onClick={handleReloadBtnClick}>
              Reload
            </PopupMenuBtn>
          </PopupMenu>
        </div>

      </div>
      {/* Header */}


      {/* Body */}
      <div className="chats-page__body">

        <div className={classNames('chats-page__search-input-wrapper', { 'chats-page__search-input-wrapper--active': isSearchInputWrapperActive })}>
          <Icon className="chats-page__search-icon">search</Icon>
          <input 
            type="text" 
            className="chats-page__search-input" 
            placeholder="Search"
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value })}
            onFocus={handleSearchInputFocus}
            onBlur={handleSearchInputBlur}
          />
        </div>

        {usersFetchingStatus === 'loading' && (
          <Loader size="md" color="grey" className="chats-page__loader" />
        )}

        {usersFetchingStatus === 'loaded' && <>
          <div className="chats-page__chats">
            {filteredUsers.map((user, i) => {
              if (user._id === currentUser._id) return

              return (
                <ChatsItem
                  key={i}
                  user={user}
                  isOnline={getIsUserOnline(user)}
                />
              )
            })}
          </div>
          <button type="button" className="chats-page__load-more-btn" onClick={handleReloadBtnClick}>
            <Icon>refresh</Icon>
          </button>
        </>}


      </div>
      {/* Body */}


    </div>
  )
}

export default ChatsPage
