import classNames from "classnames"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
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
  const [image, setImage] = useState(null)
  const [imageData, setImageData] = useState(null)
  const [isMenuHidden, setIsMenuHidden] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const params = useParams()
  const navigate = useNavigate()

  const bodyRef = useRef(null)
  const imageFileInputRef = useRef()

  const messages = useSelector((state) => selectMessages(state))
  const messagesFetchingStatus = useSelector((state) => selectMessagesFetchingStatus(state))
  const user = useSelector((state) => selectUserById(state, params._id))
  const usersOnline = useSelector((state) => selectUsersOnline(state))

  useEffect(() => {
    if (image) {
      const reader = new FileReader()

      reader.readAsDataURL(image)
  
      reader.onload = () => {
        setImageData(reader.result)
      }
    } else {
      setImageData(null)
    }
  }, [image])

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
      if (image) {
        sendMessage({ text, receiverId: user._id, imageUrl: imageData })
      } else {
        sendMessage({ text, receiverId: user._id })
      }
    }
  })

  const dispatch = useDispatch()

  const sendMessage = async ({ text, receiverId, imageUrl }) => {
    try {
      setIsSending(true)
      const { data } = await dispatch(messagesActions.createMessage({ text, receiverId, imageUrl })).unwrap()
      
      socket.emit('sendMessage', { message: data.message, receiverId: user._id })

    } catch (e) {

    } finally {
      setIsSending(false)
      messageForm.resetForm()
    }
  }

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
    dispatch(messagesActions.fetchMessages({ communicatorId: user._id }))
  }

  const scrollToDown = () => {
    bodyRef.current?.scrollTo(0, bodyRef.current?.scrollHeight)
  }
  
  const handleOpenMenuBtnClick = () => {
    setIsMenuHidden(false)
  }

  const handleMenuClose = () => {
    setIsMenuHidden(true)
  }

  const handleAddImageBtnClick = () => {
    imageFileInputRef.current.click()
  }

  const handleImageFileInputChange = (e) => {
    const file = e.target.files[0]

    setImage(file)
  }

  const handleRemoveImageBtnClick = () => {
    setImage(null)
    imageFileInputRef.current.value = null
  }

  const handleProfileBtnClick = () => {
    navigate(`/messenger/profile/${user._id}`)
  }
  
  return (
    <div className="chat-page">
      

      {/* Header */}
      <div className="chat-page__header">

        <Link className="chat-page__go-back-link" to={'/messenger/home'}>
          <Icon>arrow_back</Icon>
        </Link>

        <Avatar src={user.avatarUrl} className="chat-page__avatar" />

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
            <PopupMenuBtn icon="person" onClick={handleProfileBtnClick}>
              Profile
            </PopupMenuBtn>
          </PopupMenu>
        </div>

      </div>
      {/* Header */}


      {/* Body */}
      <div className="chat-page__body" ref={bodyRef}>

        {messagesFetchingStatus === 'loading' && (
          <Loader size="md" color="black" className="chat-page__loader" />
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

        <button type="button" className="chat-page__add-image-btn" onClick={handleAddImageBtnClick}>
          <Icon>photo_camera</Icon>
        </button>

        <input 
          type="text" 
          placeholder="Message"
          className={classNames('chat-page__text-input')} 
          {...messageForm.getFieldProps('text')}
        />

        <LoadingButton
          isLoading={isSending} 
          type="submit" 
          className="chat-page__send-message-btn"
          loaderProps={{ color: 'blue' }}
          disabled={!messageForm.isValid}
        >
          <Icon variant="filled">send</Icon>
        </LoadingButton>
        
        {imageData && (
          <div className="chat-page__image-preview-wrapper">
            <img src={imageData} className="chat-page__image-preview" />
            <button type="button" className="chat-page__remove-image-btn" onClick={handleRemoveImageBtnClick}>
              <Icon>close</Icon>
            </button>
          </div>
        )}
      </form>
      {/* Footer */}


      <input type="file" onChange={handleImageFileInputChange} ref={imageFileInputRef} hidden />
    </div>
  )
}

export default ChatPage
