import pt from 'prop-types'
import { useState } from 'react'
import Avatar from './Avatar'


const ChatsItem = ({ user, lastMessage, isOnline }) => {
  return (
    <div className='chats-item'>


      <div className="chats-item__left">
        
        <div className="chats-item__avatar-wrapper">
          <Avatar
            src={user.avatarUrl || 'https://scontent.ftas1-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-5&_nc_sid=7206a8&_nc_ohc=d5JXCdeo3tYAX9LSHjH&_nc_ht=scontent.ftas1-1.fna&oh=00_AT-t29T75UpmjHCxJ3lMS-NKhdRwrxRIQDhI3y0xvhXC7Q&oe=6204B6F8'}
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
