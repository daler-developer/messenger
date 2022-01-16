import classNames from 'classnames'
import pt from 'prop-types'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectCurrentUserId } from 'redux/reducers/authReducer'
import { selectUserById } from 'redux/reducers/usersReducer'
import Avatar from './Avatar'


const Message = ({ data, className }) => {

  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const sender = useSelector((state) => selectUserById(state, data.senderId))

  const navigate = useNavigate()

  const isCurrentUserSender = () => {
    return sender._id === currentUser._id
  }

  const getGeneratedTime = () => {
    const createdDate = new Date(Date.parse(data.createdAt))

    return `${createdDate.getHours()}:${createdDate.getMinutes()}`
  }

  const handleAvatarClick = () => {
    navigate(`/messenger/profile/${sender._id}`)
  }

  return (
    <div 
      className={classNames('message', 
        { 'message--sent-by-current-user': isCurrentUserSender() },  
      )}
    >
      

      {/* Avatar */}
      <Avatar user={sender} className="message__avatar" onClick={handleAvatarClick} />
      {/* Avatar */}


      {/* Display name */}
      <div className="message__display-name">
        {sender.displayName}
      </div>
      {/* Display name */}


      {/* Body */}
      <div className="message__body">

        <div className="message__text">
          {data.text}
        </div>

        <div className="message__created-at">
          {getGeneratedTime()}
        </div>

      </div>
      {/* Body */}


    </div>
  )
}

Message.propTypes = {
  data: pt.object.isRequired,
  className: pt.string
}

export default Message
