import pt from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import Icon from './Icon'
import PopupMenu from './PopupMenu'


const ChatsItem = ({ user, lastMessage, isOnline }) => {
  const [isPopupMenuHidden, setIsPopupMenuHidden] = useState(true)

  const navigate = useNavigate()

  const handlePopupMenuClose = () => {
    setIsPopupMenuHidden(true)
  }

  const handleOpenPopupMenuBtnClick = (e) => {
    e.stopPropagation()
    
    setIsPopupMenuHidden(false)
  }

  const handleViewProfileBtnClick = () => {
    navigate(`/messenger/profile?userId=${user._id}`)
  }

  const handleHideUserBtnClick = () => {

  }

  const handleChatsItemClick = () => {
    navigate(`/messenger/chats/${user._id}`)
  }

  return (
    <div className='chats-item' onClick={handleChatsItemClick}>
        
      <div className="chats-item__avatar-wrapper">
        <Avatar
          src={user.avatarUrl}
          className="chats-item__avatar"
        />
        {isOnline && (
          <div className="chats-item__green-dot" />
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
          <button type="button" className="chats-item__menu-btn" onClick={handleViewProfileBtnClick}>
            <Icon>account_circle</Icon>
            <span>Profile</span>
          </button> 
        </PopupMenu>
      </div>
      
    </div>
  )
}

ChatsItem.propTypes = {
  user: pt.object.isRequired,
  isOnline: pt.bool.isRequired,
  lastMessage: pt.string
}

export default ChatsItem
