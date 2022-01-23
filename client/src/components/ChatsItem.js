import classNames from 'classnames'
import pt from 'prop-types'
import { useMemo } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUsersOnline, usersActions } from 'redux/reducers/usersReducer'
import Avatar from './Avatar'
import Icon from './Icon'
import PopupMenu from './PopupMenu'
import PopupMenuBtn from './PopupMenuBtn'


const ChatsItem = ({ user, lastMessage }) => {
  const [isPopupMenuHidden, setIsPopupMenuHidden] = useState(true)

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const usersOnline = useSelector((state) => selectUsersOnline(state))

  const isOnline = useMemo(() => {
    return Boolean(usersOnline.find((userOnline) => userOnline.userId === user._id))
  }, [usersOnline])

  const handlePopupMenuClose = () => {
    setIsPopupMenuHidden(true)
  }

  const handleOpenPopupMenuBtnClick = (e) => {
    e.stopPropagation()
    
    setIsPopupMenuHidden(false)
  }

  const handleViewProfileBtnClick = () => {
    navigate(`/messenger/profile/${user._id}`)
  }

  const handleHideUserBtnClick = () => {
    dispatch(usersActions.setIsUserHidden({ userId: user._id, to: true }))
  }

  const handleChatsItemClick = () => {
    navigate(`/messenger/chats/${user._id}`)
  }

  return (
    <div className={classNames('chats-item', { 'chats-item--hidden': user.isHidden })} onClick={handleChatsItemClick}>
        
      <div className="chats-item__avatar-wrapper">
        <Avatar
          src={user.avatarUrl}
          className="chats-item__avatar"
        />
        {isOnline && (
          <div className="chats-item__avatar-dot" />
        )}
      </div>

      <div className="chats-item__display-name">
        {user.displayName}
      </div>

      <div className="chats-item__last-message">
        {lastMessage || 'Tap to open'} 
      </div> 

      <div className="chats-item__open-menu-btn-wrapper">
        <button type="button" className="chats-item__open-menu-btn" onClick={handleOpenPopupMenuBtnClick}>
          <Icon>more_vert</Icon>
        </button>
        <PopupMenu className="chats-item__popup-menu" isHidden={isPopupMenuHidden} onClose={handlePopupMenuClose}>
          <PopupMenuBtn icon="account_circle" onClick={handleViewProfileBtnClick}>
            Profile
          </PopupMenuBtn>
          <PopupMenuBtn icon="visibility_off" onClick={handleHideUserBtnClick}>
            Hide
          </PopupMenuBtn>
        </PopupMenu>
      </div>
      
    </div>
  )
}

ChatsItem.propTypes = {
  user: pt.object.isRequired,
  lastMessage: pt.string
}

export default ChatsItem
