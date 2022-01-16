import classNames from "classnames"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { selectCurrentUserId } from "redux/reducers/authReducer"
import { messagesActions, selectMessages, selectMessagesFetchingStatus } from "redux/reducers/messagesReducer"
import { selectUserById, selectUsersOnline } from "redux/reducers/usersReducer"
import socket from "socket"
import Avatar from "./Avatar"
import Icon from "./Icon"
import Loader from "./Loader"
import LoadingButton from "./LoadingButton"
import Message from "./Message"
import PopupMenu from "./PopupMenu"
import PopupMenuBtn from "./PopupMenuBtn"

const ChatPage = () => {
  const [isMenuHidden, setIsMenuHidden] = useState(true)

  const params = useParams()
  const navigate = useNavigate()

  const bodyRef = useRef(null)

  const messages = useSelector((state) => selectMessages(state))
  const messagesFetchingStatus = useSelector((state) => selectMessagesFetchingStatus(state))
  const user = useSelector((state) => selectUserById(state, params._id))
  const usersOnline = useSelector((state) => selectUsersOnline(state))

  useEffect(() => {
    loadMessages()
    watchSendMessage()

    return () => {
      dispatch(messagesActions.setMessagesFetchingStatus('idle'))
      socket.removeAllListeners('sendMessage')
    }
  }, [])

  useEffect(() => {
    scrollToDown()
  }, [messages])

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

  const dispatch = useDispatch()

  const watchSendMessage = () => {
    socket.on('sendMessage', (message) => {
      console.log(message)
      dispatch(messagesActions.addMessage(message))
    })
  }

  const getIsOnline = () => {
    return Boolean(usersOnline.find((userOnline) => userOnline.userId === user._id))
  }
  
  const loadMessages = async () => {
    try {
      const { data } = await dispatch(messagesActions.fetchMessages({ communicatorId: user._id })).unwrap()

      dispatch(messagesActions.setMessages(data.messages))
    } catch (e) {
      alert('error')
    }
  }

  const scrollToDown = () => {
    bodyRef.current?.scrollTo(0, bodyRef.current?.scrollHeight)
  }
  
  const handleGoBackBtnClick = () => {
    navigate('/messenger/chats')
  }
  const handleOpenMenuBtnClick = () => {
    setIsMenuHidden(false)
  }

  const handleMenuClose = () => {
    setIsMenuHidden(true)
  }
  
  return (
    <div className="chat-page">
      

      {/* Header */}
      <div className="chat-page__header">

        <button className="chat-page__go-back-btn" onClick={handleGoBackBtnClick}>
          <Icon>arrow_back</Icon>
        </button>

        <Avatar user={user} className="chat-page__avatar" />

        <div className="chat-page__title">
          {user.displayName}
        </div>

        <div className="chat-page__sub-title">
          {getIsOnline() && (
            <span className="chat-page__online-status-label">Online</span>
          )}
          {!getIsOnline() && (
            <span className="chat-page__offline-status-label">Offline</span>
          )}
        </div>

        <div className="chat-page__menu-wrapper">
          <button type="button" className="chat-page__open-menu-btn" onClick={handleOpenMenuBtnClick}>
            <Icon>more_vert</Icon>
          </button>
          <PopupMenu className="chat-page__menu" isHidden={isMenuHidden} onClose={handleMenuClose}>
            <PopupMenuBtn icon="person" onClick={() => {}}>
              Profile
            </PopupMenuBtn>
          </PopupMenu>
        </div>

      </div>
      {/* Header */}


      {/* Body */}
      <div className="chat-page__body" ref={bodyRef}>

        {messagesFetchingStatus === 'loading' && (
          <Loader size="md" color="grey" className="chat-page__loader" />
        )}

        {messagesFetchingStatus === 'loaded' && (
          <div className="chat-page__messages">
            {messages.map((message) => (
              <Message
                key={message._id}
                data={message}
                className={classNames('chat-page__message')}
              />
            ))}
          </div>
        )}

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

        <LoadingButton
          isLoading={messageForm.isSubmitting} 
          type="submit" 
          className="chat-page__send-message-btn"
          loaderProps={{ color: 'blue' }}
        >
          <Icon variant="filled">send</Icon>
        </LoadingButton>

      </form>
      {/* Footer */}


    </div>
  )
}

export default ChatPage
