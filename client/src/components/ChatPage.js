import classNames from "classnames"
import { useFormik } from "formik"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { selectCurrentUser } from "redux/reducers/authReducer"
import { messagesActions, selectMessages } from "redux/reducers/messagesReducer"
import { selectUserById } from "redux/reducers/usersReducer"
import socket from "socket"
import Avatar from "./Avatar"
import Icon from "./Icon"
import LoadingButton from "./LoadingButton"
import Message from "./Message"

const ChatPage = () => {
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadMessages()
    watchSendMessage()
  }, [])

  const messageForm = useFormik({
    initialValues: {
      text: ''
    },
    validate(v) {
      const errors = {}

      if (!v.text.trim()) {
        errors.message = 'Empty message'
      }

      return errors
    },
    async onSubmit({ text }) {
      try {
        const { data } = await dispatch(messagesActions.createMessage({ text: text.trim(), receiverId: user._id })).unwrap()
        
        socket.emit('sendMessage', { message: data.message, receiverId: user._id })
      } catch (e) {

      } finally {
        messageForm.resetForm()
      }
    }
  })

  const messages = useSelector((state) => selectMessages(state))
  const currentUser = useSelector((state) => selectCurrentUser(state))
  const user = useSelector((state) => selectUserById(state, params._id))

  const dispatch = useDispatch()

  const watchSendMessage = () => {
    socket.on('sendMessage', (message) => {
      dispatch(messagesActions.addMessage(message))
    })
  }

  const loadMessages = async () => {
    try {
      const { data } = await dispatch(messagesActions.fetchMessages({ communicatorId: user._id })).unwrap()

      dispatch(messagesActions.setMessages(data.messages))
    } catch (e) {
      alert('error')
    }
  }

  const handleGoBackBtnClick = () => {
    navigate('/messenger/chats')
  }

  return (
    <div className="chat-page">
      

      {/* Header */}
      <div className="chat-page__header">

        <button className="chat-page__go-back-btn" onClick={handleGoBackBtnClick}>
          <Icon>arrow_back</Icon>
        </button>

        <Avatar src={user.avatarUrl} className="chat-page__avatar" />

        <div className="chat-page__display-name">
          {user.displayName}
        </div>

        <div className="chat-page__online-status">
          Online
        </div>

        <div className="chat-page__menu-btn-wrapper">
          <Icon>more_vert</Icon>
        </div>

      </div>
      {/* Header */}


      {/* Body */}
      <div className="chat-page__body">
      
        <div className="chat-page__messages">
          {messages.map((message) => (
            <Message
              key={message._id}
              data={message}
              className={classNames('chat-page__message')}
            />
          ))}
        </div>

      </div>
      {/* Body */}


      {/* Footer */}
      <form className="chat-page__footer" onSubmit={messageForm.handleSubmit}>

        <input 
          type="text" 
          placeholder="Message"
          className={classNames('chat-page__text-input')} 
          {...messageForm.getFieldProps('text')}
        />

        <LoadingButton isLoading={messageForm.isSubmitting} type="submit" className="chat-page__send-message-btn">
          <Icon>send</Icon>
        </LoadingButton>

      </form>
      {/* Footer */}


    </div>
  )
}

export default ChatPage
