import classNames from 'classnames'
import pt from 'prop-types'
import { useSelector } from 'react-redux'
import { selectCurrentUserId } from 'redux/reducers/authReducer'
import { selectUserById } from 'redux/reducers/usersReducer'
import Avatar from './Avatar'


const Message = ({ data, className }) => {

  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const sender = useSelector((state) => selectUserById(state, data.senderId))

  const isCurrentUserSender = () => {
    return sender._id === currentUser._id
  }

  const getGeneratedTime = () => {
    const createdDate = new Date(Date.parse(data.createdAt))

    return `${createdDate.getHours()}:${createdDate.getMinutes()}`
  }

  return (
    <div 
      className={classNames('message', 
        { 'message--sent-by-current-user': isCurrentUserSender() },  
      )}
    >
      

      {/* Avatar */}
      <Avatar src={sender.avatarUrl} className="message__avatar" />
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
