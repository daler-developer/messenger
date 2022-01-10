import classNames from "classnames"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { authActions, selectCurrentUserId } from "redux/reducers/authReducer"
import { selectIsUsersOnlineStatusWatching, selectUserById, selectUsersByIncludesDisplayName, selectUsersCount, selectUsersFetchingStatus, selectUsersOnline, usersActions } from "redux/reducers/usersReducer"
import socket from "socket"
import ChatsItem from "./ChatsItem"
import Icon from "./Icon"
import Loader from "./Loader"
import PopupMenu from "./PopupMenu"
import PopupMenuBtn from "./PopupMenuBtn"


const HomePage = () => {
  const [isPopupMenuHidden, setIsPopupMenuHidden] = useState(true)
  const [isSearchInputWrapperActive, setIsSearchInputWrapperActive] = useState(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const usersCount = useSelector((state) => selectUsersCount(state))
  const filteredUsers = useSelector((state) => selectUsersByIncludesDisplayName(state, searchParams.get('search') || ''))
  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const usersFetchingStatus = useSelector((state) => selectUsersFetchingStatus(state))
  const usersOnline = useSelector((state) => selectUsersOnline(state))

  const usersOnlineCount = useMemo(() => usersOnline.length, [usersOnline])

  useEffect(() => {
    if (usersFetchingStatus === 'idle') {
      loadUsers({ excludeCurrent: true })
    }
  }, [])

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const loadUsers = async ({ excludeCurrent }) => {
    dispatch(usersActions.fetchUsers({ excludeCurrent })).unwrap()
  }  

  const handlePopupMenuClose = () => {
    setIsPopupMenuHidden(true)
  }

  const handleOpenPopupMenuBtnClick = (e) => {
    setIsPopupMenuHidden(false)
  }

  const handleLogoutBtnClick = () => {
    dispatch(authActions.setCurrentUserId(null))

    localStorage.removeItem('auth-token')

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
    loadUsers({ excludeCurrent: true })
    setIsPopupMenuHidden(true)
  }

  return (
    <div className="home-page">
      

      {/* Header */}
      <div className="home-page__header">

        <h1 className="home-page__title">
          Home
        </h1>

        <div className="home-page__menu-wrapper">
          <button type="button" className="home-page__open-menu-btn" onClick={handleOpenPopupMenuBtnClick}>
            <Icon>more_vert</Icon>
          </button>
          <PopupMenu 
            onClose={handlePopupMenuClose} 
            isHidden={isPopupMenuHidden} 
            className="home-page__menu"
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
      <div className="home-page__body">

        <div className={classNames('home-page__search-input-wrapper', { 'home-page__search-input-wrapper--active': isSearchInputWrapperActive })}>
          <Icon className="home-page__search-icon">search</Icon>
          <input 
            type="text" 
            className="home-page__search-input" 
            placeholder="Search"
            value={searchParams.get('search') || ''}
            onChange={(e) => setSearchParams({ search: e.target.value })}
            onFocus={handleSearchInputFocus}
            onBlur={handleSearchInputBlur}
          />
        </div>

        {usersFetchingStatus === 'loading' && (
          <Loader size="md" color="grey" className="home-page__loader" />
        )}

        {usersFetchingStatus === 'loaded' && <>
          <div className="home-page__chats">
            {filteredUsers.map((user, i) => {
              if (user._id === currentUser._id) return

              return (
                <ChatsItem
                  key={i}
                  user={user}
                />
              )
            })}
          </div>
        </>}


      </div>
      {/* Body */}


      {/* Footer */}
      <div className="home-page__footer">

        <span className="home-page__footer-online-count-label">
          Online: {usersOnlineCount}/{usersCount}
        </span>

        <button type="button" className="home-page__refresh-btn" onClick={handleReloadBtnClick}>
          <Icon>refresh</Icon>
        </button>

      </div>
      {/* Footer */}


    </div>
  )
}

export default HomePage
