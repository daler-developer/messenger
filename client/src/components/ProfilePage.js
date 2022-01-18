import classNames from "classnames"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { authActions, selectCurrentUserId } from "redux/reducers/authReducer"
import { uiActions } from "redux/reducers/uiReducer"
import { selectUserById, selectUsersOnline, usersActions } from "redux/reducers/usersReducer"
import * as Yup from 'yup'
import api from "utils/api"
import Avatar from "./Avatar"
import Icon from "./Icon"
import Loader from './Loader'
import LoadingButton from "./LoadingButton"


const ProfilePage = () => {
  const [isLoadingUser, setIsLoadingUser] = useState(false)
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
    async onSubmit(v) {
      try {
        const { data } = await dispatch(authActions.updateProfile(v)).unwrap()
      } finally {
        editForm.resetForm()
        setIsEditFormHidden(true)
      }
    }
  })

  const avatarFileInputRef = useRef(null)

  const params = useParams()

  const dispatch = useDispatch()

  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))
  const selectedUser = useSelector((state) => selectUserById(state, params._id))
  const usersOnline = useSelector((state) => selectUsersOnline(state))

  useEffect(() => {
    avatarFile && changeAvatar()
  }, [avatarFile])

  useEffect(() => {
 
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

  const resetEditForm = () => {
    editForm.setValues({
      displayName: '',
      bio: '',
      username: ''
    })
  }

  const isCurrentUserSelected = () => {
    return selectedUser._id === currentUser._id
  }

  const isOnline = () => {
    return Boolean(usersOnline.find((u) => u.userId === selectedUser._id))
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
    resetEditForm()
    setIsEditFormHidden(true)
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

        {isCurrentUserSelected() && (
          <button type="button" className="profile-page__update-profile-btn" onClick={handleUpdateProfileBtn}>
            <Icon>edit</Icon>
          </button>
        )}

      </div>


      <div className="profile-page__body">

        {isLoadingUser ? (
          <Loader size="md" color="grey" />
        ) : <>
          {/* Body header */}
          <div className="profile-page__body-header">

            <div className="profile-page__avatar-wrapper">

              <Avatar user={selectedUser} className="profile-page__avatar" />

              {isCurrentUserSelected() && (
                <button type="button" className={classNames('profile-page__change-avatar-btn')} onClick={handleChangeAvatarBtnClick}>
                  Change
                </button>
              )}

            </div>

            <div className="profile-page__title">
              {selectedUser.displayName}
            </div>
            
            <div className="profile-page__sub-title">
              {isOnline() && (
                <span className="profile-page__online-status-label">Online</span>
              )}
              {!isOnline() && (
                <span className="profile-page__offline-status-label">Offline</span>
              )}
            </div>

          </div>
          {/* Body header */}

          {isEditFormHidden ? <>
            {/* Username */}
            <div className="profile-page__username">
              @{selectedUser.username}
            </div>
            {/* Username */}

            {/* Bio */}
            {selectedUser.bio ? (
              <div className="profile-page__bio">
                {selectedUser.bio}
              </div>
            ) : (
              <span>No bio</span>
            )}
            {/* Bio */}
          </> : <>
            <form onSubmit={editForm.handleSubmit} className="profile-page__edit-form">

              <div className="profile-page__input-wrapper">
                <label htmlFor="username" className="profile-page__form-label">Username</label>
                <input 
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  className="profile-page__form-input"
                  {...editForm.getFieldProps('username')}   
                />
              </div>

              <div className="profile-page__input-wrapper">
                <label htmlFor="displayName" className="profile-page__form-label">Display name</label>
                <input 
                  type="text"
                  id="displayName"
                  name="displayName"
                  placeholder="Display name"
                  className="profile-page__form-input"
                  {...editForm.getFieldProps('displayName')}   
                />
              </div>

              <div className="profile-page__input-wrapper">
                <label htmlFor="bio" className="profile-page__form-label">Bio</label>
                <input 
                  type="text"
                  name="bio"
                  id="bio"
                  placeholder="Bio"
                  className="profile-page__form-input"
                  {...editForm.getFieldProps('bio')}   
                />
              </div>

              <div className="profile-page__btns-wrapper">
                <button type="button" className="profile-page__cancel-btn" onClick={handleCancelBtnClick}>
                  Cancel
                </button>  
                <LoadingButton isLoading={editForm.isSubmitting} type="submit" className="profile-page__submit-btn">
                  Edit
                </LoadingButton>
              </div>

            </form>
          </>}


        </>}


      </div>

      
      <input type="file" accept="image/*" hidden ref={avatarFileInputRef} onChange={handleAvatarFileInputChange} />
    </div>
  )
}

export default ProfilePage
