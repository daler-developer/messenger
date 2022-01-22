import classNames from "classnames"
import { useFormik } from "formik"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { authActions, selectCurrentUserId } from "redux/reducers/authReducer"
import { uiActions } from "redux/reducers/uiReducer"
import { selectUserById, selectUsersOnline, usersActions } from "redux/reducers/usersReducer"
import * as Yup from 'yup'
import api from "utils/api"
import Avatar from "./Avatar"
import Icon from "./Icon"
import Loader from './Loader'
import LoadingButton from "./LoadingButton"
import socket from "socket"


const ProfilePage = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [avatarData, setAvatarData] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [isEditFormHidden, setIsEditFormHidden] = useState(true)

  useEffect(() => {
    if (!isEditFormHidden) {
      editForm.setValues({
        username: selectedUser.username || '',
        displayName: selectedUser.displayName || '',
        bio: selectedUser.bio || ''
      })
    }
  }, [isEditFormHidden])

  const editForm = useFormik({
    initialValues: {
      username: '',
      displayName: '',
      bio: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .required('Empty username')
        .min(3, 'Too few symbols(min 3)')
        .max(15, 'Too many symbols(max 15)')
      ,
      displayName: Yup.string()
        .trim()
        .required('Empty display name')
        .min(6, 'Too few symbols(min 6)')
        .max(15, 'Too many symbols(max 15)')
      ,
      bio: Yup.string()
        .trim()
    }),
    async onSubmit({ username, displayName, bio }) {
      try {
        await dispatch(authActions.updateProfile({
          ...(username !== selectedUser.username && { username }),
          ...(displayName !== selectedUser.displayName && { displayName }),
          ...(bio !== selectedUser.bio && { bio }),
          ...(avatarData && { avatarUrl: avatarData }),
        })).unwrap()
      } finally {
        editForm.resetForm()
        setIsEditFormHidden(true)
      }
    }
  })

  const avatarFileInputRef = useRef(null)

  const params = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  
  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const selectedUser = useSelector((state) => selectUserById(state, params._id))
  const usersOnline = useSelector((state) => selectUsersOnline(state))
  
  const isCurrentUserSelected = useMemo(() => {
    return selectedUser._id === currentUser._id 
  }, [selectedUser._id, currentUser._id ])

  useEffect(() => {
    if (avatarFile) {
      generateAvatarData()
    } else {
      setAvatarData(null)
    }
  }, [avatarFile])

  const generateAvatarData = async () => {
    const reader = new FileReader()

    reader.readAsDataURL(avatarFile)

    reader.onload = () => {
      setAvatarData(reader.result)
    }
  }

  const resetForm = () => {
    editForm.resetForm()
    setAvatarFile(null)
    avatarFileInputRef.current.value = null
  }


  const handleChangeAvatarBtnClick = () => {
    avatarFileInputRef.current.click()
  }

  const handleAvatarFileInputChange = (e) => {
    const file = e.target.files[0]

    setAvatarFile(file)
  }

  const handleUpdateProfileBtn = () => {
    setIsEditFormHidden(false)
  }

  const handleCancelBtnClick = () => {
    resetForm()
    setIsEditFormHidden(true)
  }

  const handleLogoutBtnClick = () => {
    dispatch(authActions.setCurrentUserId(null))

    localStorage.removeItem('auth-token')

    navigate('/auth?tab=login')
  }

  return (
    <div className="profile-page">
      

      <div className="profile-page__header">
        
        <Link to="/messenger/home" className="profile-page__go-back-link">
          <Icon className="profile-page__go-back-icon">arrow_back</Icon>
        </Link>

        <h1 className="profile-page__header-title">
          Profile
        </h1>

        {isCurrentUserSelected && (
          <button type="button" className="profile-page__update-profile-btn" onClick={handleUpdateProfileBtn}>
            <Icon>edit</Icon>
          </button>
        )}

      </div>


      <div className="profile-page__body">

        {isLoadingUser ? (
          <Loader size="md" color="grey" />
        ) : <>

          {/* Avatar */}
          <div className="profile-page__avatar-wrapper">
            <Avatar src={selectedUser.avatarUrl} className="profile-page__avatar" />
            {!isEditFormHidden && (
              <button type="button" className="profile-page__change-avatar-btn" onClick={handleChangeAvatarBtnClick}>
                Replace
              </button>
            )}
          </div>
          {/* Avatar */}

          {isEditFormHidden ? <>
            {/* Username */}
            <div className="profile-page__grid">
              <Icon className="profile-page__grid-icon">person</Icon>
              <div className="profile-page__grid-title">
                @{selectedUser.username}
              </div>
              <div className="profile-page__grid-sub-title">
                Username
              </div>
            </div>
            {/* Username */}

            {/* Username */}
            <div className="profile-page__grid">
              <Icon className="profile-page__grid-icon">badge</Icon>
              <div className="profile-page__grid-title">
                {selectedUser.displayName}
              </div>
              <div className="profile-page__grid-sub-title">
                Display name
              </div>
            </div>
            {/* Username */}

            {/* Bio */}
            {selectedUser.bio && (
              <p className="profile-page__bio">
                {selectedUser.bio}
              </p>
            )}
            {/* Bio */}
          </> : (
            <form onSubmit={editForm.handleSubmit} className="profile-page__edit-form">

              <div className="profile-page__input-wrapper">
                <label htmlFor="username" className="profile-page__form-label">
                  Username{' '}
                  <span className="profile-page__error-text">
                    {editForm.errors.username}
                  </span>
                </label>
                <input 
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  className={classNames('profile-page__form-input', { 'profile-page__form-input--error': editForm.errors.username })}
                  {...editForm.getFieldProps('username')}   
                />
              </div>

              <div className="profile-page__input-wrapper">
                <label htmlFor="displayName" className="profile-page__form-label">
                  Display name{' '}
                  <span className="profile-page__error-text">
                    {editForm.errors.displayName}
                  </span>
                </label>
                <input 
                  type="text"
                  id="displayName"
                  name="displayName"
                  placeholder="Display name"
                  className={classNames('profile-page__form-input', { 'profile-page__form-input--error': editForm.errors.displayName })}
                  {...editForm.getFieldProps('displayName')}   
                />
              </div>

              <div className="profile-page__input-wrapper">
                <label htmlFor="bio" className="profile-page__form-label">
                  Bio{' '}
                  <span className="profile-page__error-text">
                    {editForm.errors.bio}
                  </span>
                </label>
                <input 
                  type="text"
                  name="bio"
                  id="bio"
                  placeholder="Bio"
                  className={classNames('profile-page__form-input', { 'profile-page__form-input--error': editForm.errors.bio })}
                  {...editForm.getFieldProps('bio')}   
                />
              </div>

            </form>
          )}


        </>}
      </div>


      {/* Footer */}
      {isCurrentUserSelected && (
        <div className="profile-page__footer">
          {isEditFormHidden ? (
            <button type="button" className="profile-page__logout-btn" onClick={handleLogoutBtnClick}>
              Logout
            </button>
          ) : <>
            <div className="profile-page__footer-two-btns">
              <button type="button" className="profile-page__cancel-btn" onClick={handleCancelBtnClick}>
                Cancel
              </button>
              <LoadingButton isLoading={editForm.isSubmitting} type="button" className="profile-page__edit-btn" onClick={editForm.handleSubmit}>
                Edit
              </LoadingButton>
            </div>
          </>}
        </div>
      )}
      {/* Footer */}
      

      <input type="file" accept="image/*" hidden ref={avatarFileInputRef} onChange={handleAvatarFileInputChange} />
    </div>
  )
}

export default ProfilePage
