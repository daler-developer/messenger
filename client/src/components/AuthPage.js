import { useFormik } from "formik"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom"
import { authActions, selectCurrentUserId, selectIsTryingToLogin } from "redux/reducers/authReducer"
import Icon from "./Icon"
import LoadingButton from "./LoadingButton"
import * as Yup from 'yup'
import classNames from "classnames"
import { useSelector } from "react-redux"
import FullScreenLoader from "./FullScreenLoader"
import { selectUserById } from "redux/reducers/usersReducer"


const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const isTryingToLogin = useSelector((state) => selectIsTryingToLogin(state))
  const currentUser = useSelector((state) => selectUserById(state, selectCurrentUserId(state)))

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'login' })
    }
  }, [])

  const form = useFormik({
    initialValues: {
      username: '',
      password: '',
      displayName: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .trim()
        .required('Empty username')
        .min(3, 'Too few symbols(min 3)')
        .max(15, 'Too many symbols(max 15)')
      ,
      password: Yup.string()
        .trim()
        .required('Empty password')
        .min(6, 'Too few symbols(min 6)')
        .max(15, 'Too many symbols(max 15)')
      ,
      ...(searchParams.get('tab') === 'register' && {
        displayName: Yup.string()
          .trim()
          .required('Empty display name')
          .min(6, 'Too few symbols(min 6)')
          .max(15, 'Too many symbols(max 15)')
      })
      ,
    }),
    async onSubmit({ username, password, displayName }) {
      try {
        if (searchParams.get('tab') === 'register') {
  
          await dispatch(authActions.register({ username, password, displayName })).unwrap()
        } else if (searchParams.get('tab') === 'login') {

          await dispatch(authActions.login({ username, password })).unwrap()
        }
        
        navigate('/messenger/chats')
      } finally {
        form.resetForm()
      }
    }
  })

  if (isTryingToLogin) {
    return <FullScreenLoader />
  }

  if (currentUser) {
    return <Navigate to="/messenger/home" state={{ from: '/auth' }} />
  }

  return (
    <div className="auth-page">
      <form className="auth-page__form" onSubmit={form.handleSubmit}>


        <h1 className="auth-page__title">
          {searchParams.get('tab') === 'login' && 'Login'}
          {searchParams.get('tab') === 'register' && 'Register'}
        </h1>


        <div className="auth-page__input-group">

          <input 
            type="text" 
            className={classNames('auth-page__input', { 'auth-page__input--error': form.touched.username && form.errors.username })}
            placeholder="Username"
            {...form.getFieldProps('username')}
          />

          <div className="auth-page__icon-wrapper">
            <Icon className="auth-page__icon">person</Icon>
          </div>

        </div>


        {form.touched.username && form.errors.username && (
          <div className="auth-page__error-label">
            {form.errors.username}
          </div>
        )}


        {searchParams.get('tab') === 'register' && (
          <div className="auth-page__input-group">

            <input 
              type="text" 
              className={classNames('auth-page__input', { 'auth-page__input--error': form.touched.displayName && form.errors.displayName })} 
              placeholder="Display name"
              {...form.getFieldProps('displayName')}
            />

            <div className="auth-page__icon-wrapper">
              <Icon className="auth-page__icon">face</Icon>
            </div>

          </div>
        )}


        {form.touched.displayName && form.errors.displayName && searchParams.get('tab') === 'register' && (
          <div className="auth-page__error-label">
            {form.errors.displayName}
          </div>
        )}


        <div className="auth-page__input-group">

          <input 
            type="password" 
            className={classNames('auth-page__input', { 'auth-page__input--error': form.touched.password && form.errors.password })}
            placeholder="Password"
            {...form.getFieldProps('password')}
          />

          <div className="auth-page__icon-wrapper">
            <Icon className="auth-page__icon">lock</Icon>
          </div>

        </div>


        {form.touched.password && form.errors.password && (
          <div className="auth-page__error-label">
            {form.errors.password}
          </div>
        )}

        
        <LoadingButton className="auth-page__submit-btn" type="submit" isLoading={form.isSubmitting}>
          {searchParams.get('tab') === 'login' && 'Login'}
          {searchParams.get('tab') === 'register' && 'Register'}
        </LoadingButton>



        <div className="auth-page__footer">
          {searchParams.get('tab') === 'login' && (
            <Link to="/auth?tab=register" role="register-link">
              Don't have an account? Register
            </Link>
          )}
          {searchParams.get('tab') === 'register' && (
            <Link to="/auth?tab=login">
              Already have an account? Login
            </Link>
          )}
        </div>


      </form>
    </div>
  )
}

export default AuthPage
