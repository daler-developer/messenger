import classNames from "classnames"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { Link, useSearchParams } from "react-router-dom"
import { authActions, selectCurrentUser } from "redux/reducers/authReducer"
import { uiActions } from "redux/reducers/uiReducer"
import api from "utils/api"
import Icon from "./Icon"

const ProfilePage = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [user, setUser] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  const avatarFileInputRef = useRef(null)

  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useDispatch()

  const currentUser = useSelector((state) => selectCurrentUser(state))

  useEffect(() => {
    avatarFile && changeAvatar()
  }, [avatarFile])

  useEffect(() => {
    loadUser(searchParams.get('userId'))
  }, [])

  const changeAvatar = async () => {
    const reader = new FileReader()

    reader.readAsDataURL(avatarFile)

    reader.onload = () => {
      try {
        dispatch(authActions.updateProfile({ avatarUrl: reader.result }))
      } catch(e) {

      } finally {
        
      }
    }
  }

  const loadUser = async (_id) => {
    if (!_id) alert('no _id')
    
    try {
      setIsLoadingUser(true)

      const { data } = await api.get(`/users/${_id}`)

      setUser(data.user)

    } catch (e) {
      dispatch(uiActions.openAlert({ type: 'error', text: e.response.data.message }))
    } finally {
      setIsLoadingUser(false)
    }
  }

  const isCurrentUserSelected = () => {
    return user._id === currentUser._id
  }

  const handleChangeAvatarBtnClick = () => {
    avatarFileInputRef.current.click()
  }

  const handleAvatarFileInputChange = (e) => {
    const file = e.target.files[0]

    setAvatarFile(file)
  }

  const handleUpdateProfileBtn = () => {

  }

  return (
    <div className="profile-page">
      

      <div className="profile-page__header">
        
        <Link to="/messenger/chats" className="profile-page__go-back-link">
          <Icon className="profile-page__go-back-icon">arrow_back</Icon>
        </Link>

        <h1 className="profile-page__title">
          Profile
        </h1>


      </div>


      {isLoadingUser ? (
        <span>Loading</span>
      ) : (
        <div className="profile-page__body">

          {/* Body header */}
          <div className="profile-page__body-header">

            <div className="profile-page__avatar-wrapper">

              {user.displayName.substring(0, 1)}

              {user.avatarUrl && (
                <img src={user.avatarUrl} className="profile-page__avatar" />
              )}

              {isCurrentUserSelected() && (
                <button type="button" className={classNames('profile-page__change-avatar-btn')} onClick={handleChangeAvatarBtnClick}>
                  Change
                </button>
              )}

            </div>

            <div className="profile-page__display-name">
              {user.displayName}
            </div>
            
            <div className="profile-page__status">
              {isCurrentUserSelected() && 'Online'}
            </div>

          </div>
          {/* Body header */}

          {/* Username */}
          <div className="profile-page__username">
            @{user.username}
          </div>
          {/* Username */}

          {/* Bio */}
            {user.bio ? (
              <div className="profile-page__bio">
                {user.bio}
              </div>
            ) : (
              <span>No bio</span>
            )}
          {/* Bio */}

        </div>
      )}


      <div className="profile-page__footer">
        <button type="button" className="profile-page__update-profile-btn" onClick={handleUpdateProfileBtn}>
          Update profile
        </button>
      </div>
      
      <input type="file" accept="image/*" hidden ref={avatarFileInputRef} onChange={handleAvatarFileInputChange} />
    </div>
  )
}

export default ProfilePage
